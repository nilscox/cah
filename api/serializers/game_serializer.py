from rest_framework import serializers
from api.models import Game, GameTurn
from .player_serializer import PlayerLightSerializer
from .choice_serializer import ChoiceSerializer
from .question_serializer import QuestionSerializer
from .answered_question_serializer import \
    LightAnsweredQuestionSerializer, \
    AnsweredQuestionSerializer, \
    PartialAnsweredQuestionSerializer

class FullGameSerializer(serializers.ModelSerializer):
    """
    FullGame: {
        id: integer,
        lang: string,
        state: string,
        play_state: string,
        players: string[],
        owner: string,
        question_master: string,
        question: Question,
        propositions: AnsweredQuestion[],
    }
    """

    state = serializers.ReadOnlyField()
    play_state = serializers.SerializerMethodField()
    players = serializers.SerializerMethodField()
    owner = serializers.ReadOnlyField(source='owner.nick')
    question_master = serializers.ReadOnlyField(source='question_master.nick')
    question = QuestionSerializer(source='current_question', read_only=True)
    propositions = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ('id', 'lang', 'state', 'play_state', 'owner', 'players', 'question_master', 'question', 'propositions')

    def get_players(self, game):
        return [ p.nick for p in game.players.all() ]

    def get_play_state(self, game):
        answers = game.get_propositions()

        if answers is None:
            return None

        if len(answers) == game.players.count() - 1:
            last_turn = game.turns.last()
            if last_turn and game.current_question == last_turn.question:
                return "end_of_turn"

            return "question_master_selection"

        return "players_answer"

    def get_propositions(self, game):
        answers = game.get_propositions()

        if answers is None:
            return None

        return AnsweredQuestionSerializer(answers, many=True).data

class GameSerializer(FullGameSerializer):

    """
    Game: {
        id: integer,
        lang: string,
        state: string,
        play_state: string,
        players: Player[],
        owner: string,
        question_master: string,
        question: Question,
        propositions: PartialAnsweredQuestion[],
    }
    """

    players = PlayerLightSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'lang', 'state', 'play_state', 'owner', 'players', 'question_master', 'question', 'propositions')

    def get_propositions(self, game):
        answers = game.get_propositions()

        if answers is None:
            return None

        if len(answers) != game.players.count() - 1:
            return []

        return PartialAnsweredQuestionSerializer(answers, many=True).data

class GameTurnSerializer(serializers.ModelSerializer):
    """
    GameTurn: {
        number: integer,
        question_master: string,
        winner: string,
        question: Question,
        answers: LightAnsweredQuestion[],
    }
    """

    number = serializers.IntegerField(read_only=True)
    question_master = serializers.ReadOnlyField(source='question_master.nick')
    winner = serializers.ReadOnlyField(source='winner.nick')
    question = QuestionSerializer(read_only=True)
    answers = LightAnsweredQuestionSerializer(read_only=True, many=True)

    class Meta:
        model = GameTurn
        fields = ('number', 'question_master', 'winner', 'question', 'answers')

class GameListItemSerializer(GameSerializer):
    """
    GameListItem: {
        id: integer,
        lang: string,
        owner: string,
        players: Player[],
        state: string,
    }
    """

    class Meta:
        model = Game
        fields = ('id', 'lang', 'owner', 'players', 'state')
