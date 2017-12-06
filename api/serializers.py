from rest_framework import serializers

from api.models import Game, Player, Question, Choice, AnsweredQuestion


class QuestionSerializer(serializers.ModelSerializer):
    """
    Question: {
        id: integer,
        text: string,
        nb_choices: integer,
    }
    """

    text = serializers.SerializerMethodField(source='__str__', read_only=True)
    nb_choices = serializers.ReadOnlyField(source='get_nb_choices')

    class Meta:
        model = Question
        fields = ('id', 'text', 'nb_choices')

    def get_text(self, gq):
        return str(gq)


class ChoiceSerializer(serializers.ModelSerializer):
    """
    Choice: {
        id: integer,
        text: string,
    }
    """

    text = serializers.ReadOnlyField(source='__str__')

    class Meta:
        model = Choice
        fields = ('id', 'text')


class PlayerSerializer(serializers.ModelSerializer):
    """
    Player: {
        nick: string,
        score: integer,
    }
    """

    score = serializers.ReadOnlyField(source='get_score')

    class Meta:
        model = Player
        fields = ('nick', 'score')


class FullPlayerSerializer(PlayerSerializer):
    """
    FullPlayer: {
        nick: string,
        score: integer,
        cards: Choice[],
    }
    """

    cards = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Player
        fields = ('nick', 'score', 'cards')


class GameSerializer(serializers.ModelSerializer):
    """
    Game: {
        id: integer,
        state: string,
        owner: string,
        players: Player[],
        current_player: string,
        current_question: Question
    }
    """

    players = PlayerSerializer(many=True, read_only=True)
    state = serializers.ReadOnlyField()
    owner = serializers.ReadOnlyField(source='owner.nick')
    current_player = serializers.ReadOnlyField(source='current_player.nick')
    current_question = QuestionSerializer(read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'state', 'owner', 'players', 'current_player', 'current_question')


class AnsweredQuestionSerializer(serializers.ModelSerializer):
    """
    AnsweredQuestion: {
        id: integer,
        answered_by: Player,
        text: string,
        answers: string[],
    }
    """

    answered_by = serializers.ReadOnlyField(source='answered_by.nick')
    text = serializers.ReadOnlyField(source='__str__')
    answers = serializers.SerializerMethodField()

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'answered_by', 'text', 'answers')

    def get_answers(self, aq):
        return map(str, aq.answers.all())
