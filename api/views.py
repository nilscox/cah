import os

from datetime import datetime
from rest_framework import views
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from api import game as game_controller, events
from api.exceptions import *
from api.models import Game, Player, AnsweredQuestion
from api.authentication import PlayerAuthentication
from api.permissions import IsPlayer, IsConnected
from api.serializers import GameSerializer, \
    GameTurnSerializer, \
    GameListItemSerializer, \
    PlayerLightSerializer, \
    PlayerSerializer ,\
    AnsweredQuestionSerializer


AVATARS_DIR = os.environ['CAH_AVATARS_DIR']


@api_view()
def root(request):
    return Response()


class PlayerViews(views.APIView):
    authentication_classes = [PlayerAuthentication]

    @staticmethod
    def player_serializer(player, *args, **kwargs):
        serializer = PlayerSerializer if player.in_game() else PlayerLightSerializer
        return serializer(player, *args, **kwargs)

    @staticmethod
    def serialize_player(player):
        return PlayerViews.player_serializer(player).data

    def post(self, request, format=None):
        nick = request.data.get('nick')

        if not nick:
            raise ValidationError('Missing nick field')

        player, created = Player.objects.get_or_create(nick=nick)
        request.session['player_id'] = player.id

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK

        return Response(PlayerViews.serialize_player(player), status_code)

    def get(self, request, format=None):
        if not isinstance(request.user, Player):
            raise PlayerNotFound

        return Response(PlayerViews.serialize_player(request.user))

    def put(self, request, format=None):
        if not isinstance(request.user, Player):
            raise PlayerNotFound

        serializer = PlayerViews.player_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)

    def delete(self, request, format=None):
        if not isinstance(request.user, Player):
            raise PlayerNotFound

        del request.session['player_id']

        return Response(None, status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def avatar(request):
    player = request.user

    if 'avatar' not in request.FILES:
        raise ValidationError('Missing avatar field')

    serializer = PlayerSerializer(player, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)

    serializer.save()

    events.player_avatar_changed(player)

    return Response(serializer.data)

class GameViews(views.APIView):
    authentication_classes = [PlayerAuthentication]
    permission_classes = [IsPlayer]

    def get(self, request, format=None):
        player = request.user
        game = player.game

        if not game:
            raise GameNotFound

        return Response(GameSerializer(game).data)

    def post(self, request, format=None):
        player = request.user

        if player.in_game():
            raise PlayerAlreadyInGame

        lang = request.data.get('lang')
        if not lang:
            raise ValidationError('Missing lang field')

        game_serializer = GameSerializer(data=request.data)
        game_serializer.is_valid(raise_exception=True)
        game = game_serializer.save(lang=lang, owner=player, players=[player])
        game_controller.init(game)

        return Response(game_serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def games_list(request):
    games = Game.objects.all()

    return Response(GameListItemSerializer(games, many=True).data)


@api_view(['GET'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def game_history(request):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game

    if game.state == 'idle':
        raise GameNotStarted

    return Response(GameTurnSerializer(game.get_history(), many=True).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer, IsConnected])
def join_game(request, pk):
    player = request.user

    if player.in_game():
        raise PlayerAlreadyInGame

    try:
        game = Game.objects.get(pk=pk)
    except Game.DoesNotExist:
        raise GameNotFound

    if False and game.state != 'idle':
        raise GameAlreadyStarted

    game.add_player(player)

    return Response(GameSerializer(game).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer, IsConnected])
def leave_game(request):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game
    game.remove_player(player)

    return Response(None, status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer, IsConnected])
def start_game(request):
    player = request.user
    game = player.game

    if not player.is_owner(game):
        raise PlayerNotGameOwner

    if game.state != 'idle':
        raise GameAlreadyStarted

    game_controller.start(game)

    return Response(GameSerializer(game).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer, IsConnected])
def next_turn(request):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game

    if game.state != 'started':
        raise GameNotStarted

    if player != game.question_master:
        raise PlayerNotQuestionMaster

    answers = game.get_propositions()
    last_turn = game.turns.last()

    if len(answers) != game.players.count() - 1:
        raise TurnNotOver

    if last_turn and last_turn.question != game.current_question:
        raise TurnNotOver

    game_controller.next_turn(game, last_turn.winner)

    return Response(GameSerializer(game).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer, IsConnected])
def answer(request):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game

    if game.state != 'started':
        raise GameNotStarted

    if game.question_master == player:
        raise PlayerQuestionMaster

    if player.has_played():
        raise PlayerAlreadyAnswered

    question = game.current_question
    ids = request.data.get('ids') or request.data.get('id')

    if not ids:
        raise ValidationError('Missing ids field')

    if isinstance(ids, str):
        ids = list(map(int, ids.split(',')))

    if len(ids) != question.get_nb_choices():
        raise InvalidAnswersCount

    choices = player.cards.filter(pk__in=ids)

    if len(ids) != choices.count():
        raise InvalidAnswers

    choices = list(map(lambda id: choices.get(pk=id), ids))
    answered_question = game_controller.answer(game, choices, player)

    return Response(AnsweredQuestionSerializer(answered_question).data)


@api_view(['POST'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer, IsConnected])
def select(request, pk):
    player = request.user

    if not player.in_game():
        raise PlayerNotInGame

    game = player.game

    if game.state != 'started':
        raise GameNotStarted

    if player != game.question_master:
        raise PlayerNotQuestionMaster

    answers = game.answers.filter(question=game.current_question)

    if answers.count() != game.players.count() - 1:
        raise PlayerCantSelectAnswer

    try:
        selected = answers.get(pk=pk)
    except (ValueError, AnsweredQuestion.DoesNotExist):
        raise InvalidSelection

    game_controller.select_answer(game, selected, player)

    return Response(AnsweredQuestionSerializer(selected).data)
