from rest_framework import views
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from api.authentication import PlayerAuthentication
from api.exceptions import *
from api.models import Game, Player, AnsweredQuestion
from api.permissions import IsPlayer
from api.serializers import GameSerializer, FullPlayerSerializer, AnsweredQuestionSerializer


class PlayerViews(views.APIView):
    queryset = Player.objects.all()
    authentication_classes = [PlayerAuthentication]

    def post(self, request, format=None):
        player, created = Player.objects.get_or_create(nick=request.data.get('nick'))
        request.session['player_id'] = player.id

        return Response(FullPlayerSerializer(player).data,
                        status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    def get(self, request, format=None):
        if not isinstance(request.user, Player):
            raise PlayerNotFound

        return Response(FullPlayerSerializer(request.user).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def create_game(request):
    player = request.user

    if player.in_game():
        raise PlayerAlreadyInGame

    game_serializer = GameSerializer(data=request.data)
    game_serializer.is_valid(raise_exception=True)
    game_serializer.save(owner=player, players=[player])

    return Response(game_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def join_game(request):
    player = request.user

    if player.in_game():
        raise PlayerAlreadyInGame

    game = Game.objects.get(pk=request.query_params.get('id'))
    game.players.add(player)

    return Response(GameSerializer(game).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def leave_game(request):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game
    game.players.remove(player)

    return Response(GameSerializer(game).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def start_game(request):
    player = request.user
    game = player.game

    if not player.is_owner(game):
        raise PlayerNotGameOwner

    if game.state != 'idle':
        raise GameAlreadyStarted

    game.start()

    return Response(GameSerializer(game).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def answer(request):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game

    if game.state != 'started':
        raise GameNotStarted

    if game.current_player == player:
        raise PlayerCurrentPlayer

    if player.has_played():
        raise PlayerAlreadyAnswered

    question = game.current_question
    ids = request.data.get('ids') or request.data.get('id')

    if not ids:
        raise ValidationError('Missing ids field')

    ids = list(map(int, ids.split(',')))

    if len(ids) != question.get_nb_choices():
        raise InvalidAnswersCount

    choices = list(player.cards.filter(pk__in=ids))

    if len(ids) != len(choices):
        raise InvalidAnswers

    answered_question = AnsweredQuestion(game=game, question=question, answered_by=player)
    answered_question.save()

    positions = list(question.choices_positions.all())

    for i in range(len(choices)):
        answered_question.answers.create(position=positions[i], choice=choices[i])
        player.cards.remove(choices[i])

    return Response(AnsweredQuestionSerializer(answered_question).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def select(request):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game

    if game.state != 'started':
        raise GameNotStarted

    if player != game.current_player:
        raise PlayerNotCurrentPlayer

    answers = game.answers.filter(question=game.current_question)

    if answers.count() != game.players.count() - 1:
        raise PlayerCantSelectAnswer

    id = request.data.get('id')

    if not id:
        raise ValidationError('Missing id field')

    try:
        selected = answers.get(pk=int(id))
    except (ValueError, AnsweredQuestion.DoesNotExist):
        raise InvalidSelection

    selected.answered_by.win_card(selected)
    game.next_turn(selected.answered_by)

    return Response(AnsweredQuestionSerializer(selected).data)
