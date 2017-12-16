from rest_framework import serializers

from api.models import Game, Player, Question, Choice, AnsweredQuestion, Answer


class QuestionSerializer(serializers.ModelSerializer):
    """
    Question: {
        id: integer,
        text: string,
        split: string[],
        nb_choices: integer,
    }
    """

    text = serializers.ReadOnlyField(source='__str__')
    split = serializers.ReadOnlyField(source='get_split_text')
    nb_choices = serializers.ReadOnlyField(source='get_nb_choices')

    class Meta:
        model = Question
        fields = ('id', 'text', 'split', 'nb_choices')


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
        question_master: string,
        question: Question,
        propositions: AnsweredQuestion[],
    }
    """

    players = PlayerSerializer(many=True, read_only=True)
    state = serializers.ReadOnlyField()
    owner = serializers.ReadOnlyField(source='owner.nick')
    question_master = serializers.ReadOnlyField(source='current_player.nick')
    question = QuestionSerializer(source='current_question', read_only=True)
    propositions = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ('id', 'state', 'owner', 'players', 'question_master', 'question', 'propositions')

    def get_propositions(self, game):
        answers = game.get_propositions()

        if answers is None:
            return None

        if len(answers) != game.players.count() - 1:
            return []

        return AnsweredQuestionSerializer(answers, many=True).data


class AnsweredQuestionSerializer(serializers.ModelSerializer):
    """
    AnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        split: string[],
        answers: Choice[],
    }
    """

    text = serializers.ReadOnlyField(source='__str__')
    split = serializers.ReadOnlyField(source='get_split_text')
    answers = serializers.SerializerMethodField()

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'split', 'answers')

    def get_answers(self, aq):
        choices = list(map(lambda a: a.choice, aq.answers.all()))
        return ChoiceSerializer(choices, many=True).data


class FullAnsweredQuestionSerializer(AnsweredQuestionSerializer):
    """
    FullAnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        split: string[]
        answers: Choice[],
        answered_by: string,
        won_by: string | null,
    }
    """

    answered_by = serializers.ReadOnlyField(source='answered_by.nick')
    won_by = serializers.ReadOnlyField(source='won_by.nick')

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'split', 'answers', 'answered_by', 'won_by')
