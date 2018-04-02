from rest_framework import serializers

from api.models import Game, GameTurn, Player, Question, Choice, AnsweredQuestion


class QuestionSerializer(serializers.ModelSerializer):
    """
    Question: {
        id: integer,
        type: string,
        text: string,
        split: string[],
        nb_choices: integer,
    }
    """

    text = serializers.ReadOnlyField(source='__str__')
    type = serializers.SerializerMethodField()
    split = serializers.ReadOnlyField(source='get_split_text')
    nb_choices = serializers.ReadOnlyField(source='get_nb_choices')

    class Meta:
        model = Question
        fields = ('id', 'type', 'text', 'split', 'nb_choices')

    def get_type(self, question):
        return "question" if question.blanks.count() == 0 else "fill"


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
        connected: boolean,
        avatar: Image,
        score: integer,
        cards: Choice[],
        submitted: AnsweredQuestion,
    }
    """

    connected = serializers.SerializerMethodField()
    score = serializers.ReadOnlyField(source='get_score')
    game = serializers.PrimaryKeyRelatedField(read_only=True)
    cards = ChoiceSerializer(many=True, read_only=True)
    submitted = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ('nick', 'connected', 'avatar', 'score', 'cards', 'game', 'submitted')

    def get_connected(self, player):
        return bool(player.socket_id)

    def get_submitted(self, player):
        submitted = player.get_submitted()

        if submitted is None:
            return None

        return AnsweredQuestionSerializer(submitted).data


class PlayerLightSerializer(PlayerSerializer):
    """
    PlayerLight: {
        nick: string,
        avatar: string,
        score: integer,
        connected: boolean,
    }
    """

    class Meta:
        model = Player
        fields = ('nick', 'connected', 'avatar', 'score')


class GameSerializer(serializers.ModelSerializer):
    """
    Game: {
        id: integer,
        lang: string,
        state: string,
        play_state: string,
        owner: string,
        players: Player[],
        question_master: string,
        question: Question,
        propositions: PartialAnsweredQuestion[],
    }
    """

    players = PlayerLightSerializer(many=True, read_only=True)
    state = serializers.ReadOnlyField()
    play_state = serializers.SerializerMethodField()
    owner = serializers.ReadOnlyField(source='owner.nick')
    question_master = serializers.ReadOnlyField(source='question_master.nick')
    question = QuestionSerializer(source='current_question', read_only=True)
    propositions = serializers.SerializerMethodField()

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


class AnsweredQuestionSerializer(serializers.ModelSerializer):
    """
    AnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        split: string[],
        answers: Choice[],
        answered_by: string,
        selected_by: string | null,
    }
    """

    question = QuestionSerializer(read_only=True)
    text = serializers.ReadOnlyField(source='__str__')
    split = serializers.ReadOnlyField(source='get_split_text')
    answers = serializers.SerializerMethodField()
    answered_by = serializers.ReadOnlyField(source='answered_by.nick')
    selected_by = serializers.ReadOnlyField(source='selected_by.nick')

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'split', 'answers', 'answered_by', 'selected_by')

    def get_answers(self, aq):
        choices = list(map(lambda a: a.choice, aq.answers.all()))
        return ChoiceSerializer(choices, many=True).data


class PartialAnsweredQuestionSerializer(AnsweredQuestionSerializer):
    """
    PartialAnsweredQuestion: {
        id: integer,
        question: Question,
        text: string,
        split: string[],
        answers: Choice[],
    }
    """

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'question', 'text', 'split', 'answers')


class LightAnsweredQuestionSerializer(AnsweredQuestionSerializer):
    """
    LightAnsweredQuestion: {
        id: integer,
        text: string,
        split: string[],
        answers: Choice[],
        answered_by: string,
    }
    """

    class Meta:
        model = AnsweredQuestion
        fields = ('id', 'text', 'split', 'answers', 'answered_by')


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

    number = serializers.IntegerField()
    question_master = serializers.ReadOnlyField(source='question_master.nick')
    winner = serializers.ReadOnlyField(source='winner.nick')
    question = QuestionSerializer(read_only=True)
    answers = LightAnsweredQuestionSerializer(read_only=True, many=True)

    class Meta:
        model = GameTurn
        fields = ('number', 'question_master', 'winner', 'question', 'answers')
