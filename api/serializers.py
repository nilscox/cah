from rest_framework import serializers

from api.models import Game, Player, Question, Choice, AnsweredQuestion, Answer


class QuestionSerializer(serializers.ModelSerializer):
    """
    Question: {
        id: integer,
        text: string,
        splitted: string[],
        nb_choices: integer,
    }
    """

    text = serializers.SerializerMethodField(source='__str__', read_only=True)
    splitted = serializers.ReadOnlyField(source='get_split_text')
    nb_choices = serializers.ReadOnlyField(source='get_nb_choices')

    class Meta:
        model = Question
        fields = ('id', 'text', 'splitted', 'nb_choices')

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
        submitted: FullAnsweredQuestion,
    }
    """

    cards = ChoiceSerializer(many=True, read_only=True)
    game = serializers.PrimaryKeyRelatedField(read_only=True)
    submitted = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ('nick', 'score', 'cards', 'game', 'submitted')

    def get_submitted(self, player):
        submitted = player.get_submitted()

        if submitted is None:
            return None

        return FullAnsweredQuestionSerializer(submitted).data


class GameSerializer(serializers.ModelSerializer):
    """
    Game: {
        id: integer,
        state: string,
        owner: string,
        players: Player[],
        current_player: string,
        question: Question,
        propositions: AnsweredQuestion[],
    }
    """

    players = PlayerSerializer(many=True, read_only=True)
    state = serializers.ReadOnlyField()
    owner = serializers.ReadOnlyField(source='owner.nick')
    current_player = serializers.ReadOnlyField(source='current_player.nick')
    question = QuestionSerializer(source='current_question', read_only=True)
    propositions = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Game
        fields = ('id', 'state', 'owner', 'players', 'current_player', 'question', 'propositions')

    def get_propositions(self, game):
        answers = game.get_current_answers()

        if answers is None:
            return None

        return AnsweredQuestionSerializer(answers, many=True).data


class AnswerSerializer(serializers.ModelSerializer):
    """
    Answer: {
        choice: Choice,
        place: integer,
    }
    """

    choice = ChoiceSerializer(read_only=True)
    place = serializers.ReadOnlyField(source='get_place')

    class Meta:
        model = Answer
        fields = ('choice', 'place')


class AnsweredQuestionSerializer(serializers.ModelSerializer):
    """
    AnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        splitted,
        choices: Answer[],
    }
    """

    text = serializers.ReadOnlyField(source='__str__')
    splitted = serializers.ReadOnlyField(source='get_split_text')
    answers = AnswerSerializer(many=True)

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'splitted', 'choices')


class FullAnsweredQuestionSerializer(AnsweredQuestionSerializer):
    """
    FullAnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        splitted: string[]
        choices: Answer[],
        answered_by: string,
        won_by: string,
    }
    """

    answered_by = serializers.ReadOnlyField(source='answered_by.nick')
    won_by = serializers.ReadOnlyField(source='won_by.nick')

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'splitted', 'choices', 'answered_by', 'won_by')
