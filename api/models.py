import random

from django.db import models

from api import events, data
from api.exceptions import *

MIN_PLAYERS_TO_START = 2


class Player(models.Model):
    """
    Player fields:
        - nick: string
        - socket_id: string

    Player relations:
        - game: Game
        - owns: Game
        - scores: PlayerScore[]
        - current_of: Game
        - cards: Choice[]
        - questions_answered: AnsweredQuestion[]
        - selected_cards: AnsweredQuestion[]
        - turns_as_question_master: GameTurn[]
        - turns_won: GameTurn[]

    Player methods:
        - in_game(Game=None) -> boolean
        - is_owner(Game) -> boolean
        - has_played() -> boolean | None
        - has_cards(integer[]) -> boolean
        - get_score(Game=None) -> integer | None
        - get_submitted() -> AnsweredQuestion
        - on_connected(socket_id) -> None
        - on_disconnected() -> None
    """

    nick = models.CharField(max_length=255, unique=True)
    socket_id = models.CharField(max_length=64, unique=True, blank=True, null=True)
    game = models.ForeignKey('Game', related_name='players', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.nick

    def in_game(self, game=None):
        if game is not None:
            return game == self.game

        return self.game is not None

    def is_owner(self, game):
        return game.owner == self

    def has_played(self):
        if self.game is None:
            return None

        return self.get_submitted() is not None

    def has_cards(self, choice_ids):
        return self.cards.filter(pk__in=choice_ids).count() == len(choice_ids)

    def get_score(self):
        if self.game is None:
            return None

        if self.game.state == 'idle':
            return 0

        return self.game.answers.filter(answered_by=self, selected_by__isnull=False).count()

    def get_submitted(self):
        if self.game is None:
            return None

        try:
            return self.game.answers.get(question=self.game.current_question, answered_by=self)
        except AnsweredQuestion.DoesNotExist:
            return None

    def pick_card(self, choices):
        choices = list(choices.filter(available=True))
        dealt = []

        for i in range(11 - self.cards.count()):
            if len(choices) == 0:
                raise NoMoreChoices

            choice = random.choice(choices)
            choice.available = False
            choice.save()
            dealt.append(choice)

            self.cards.add(choice)
            choices.remove(choice)

        events.cards_dealt(self, dealt)

    def on_connected(self, socket_id):
        self.socket_id = socket_id
        self.save()

        events.player_connected(self)

    def on_disconnected(self):
        events.player_disconnected(self)

        self.socket_id = None
        self.save()


GAME_STATES = (
    ('idle', 'idle'),
    ('started', 'started'),
    ('finished', 'finished'),
)


class Game(models.Model):
    """
    Game fields:
        - state: string

    Game relations:
        - owner: Player
        - players: Player[]
        - question_master: Player
        - questions: Question[]
        - current_question: Question
        - choices: Choice[]
        - answers: AnsweredQuestion[]
        - turns: GameTurn[]

    Game methods:
        - init() -> None
        - get_history() -> GameTurn[]
        - add_player(player) -> None
        - remove_player(player) -> None
        - start() -> None
        - next_turn(question_master) -> None
        - deal_cards() -> None
        - get_propositions() -> AnsweredQuestion[] | None
        - answer(choices, answered_by) -> None
        - select_answer(selected, selected_by) -> None
    """

    state = models.CharField(max_length=8, default='idle', choices=GAME_STATES)
    owner = models.ForeignKey(Player, related_name='owns', on_delete=models.CASCADE)
    question_master = models.ForeignKey(Player, blank=True, null=True, related_name='current_of', on_delete=models.CASCADE)
    current_question = models.ForeignKey('Question', blank=True, null=True, related_name='current', on_delete=models.CASCADE)

    def __str__(self):
        return ''.join(['Game #', str(self.id), ' (', self.state, ')'])

    def init(self):
        data_questions, data_places = data.get_questions()
        data_choices = data.get_choices()

        def create_questions():
            questions = list(map(lambda text: Question(game=self, text=text), data_questions))
            Question.objects.bulk_create(questions)

        def create_blanks():
            questions = list(self.questions.all())
            blanks = []

            for i in range(len(questions)):
                for place in data_places[i]:
                    blanks.append(Blank(question=questions[i], place=place))

            Blank.objects.bulk_create(blanks)

        def create_choices():
            choices = map(lambda text: Choice(game=self, text=text), data_choices)
            Choice.objects.bulk_create(choices)

        create_questions()
        create_blanks()
        create_choices()

        events.game_created(self.owner)

    def get_history(self):
        return self.turns.all()

    def add_player(self, player):
        self.players.add(player)
        events.game_joined(player)

    def remove_player(self, player):
        self.players.remove(player)
        events.game_left(player)

    def start(self):
        if self.players.count() < MIN_PLAYERS_TO_START:
            raise NotEnoughPlayers

        self.state = 'started'
        self.question_master = random.choice(self.players.all())

        self.deal_cards()
        self.pick_question()
        self.save()

        events.game_started(self)

    def next_turn(self, question_master):
        self.question_master = question_master

        self.deal_cards()
        self.pick_question()
        self.save()

        events.next_turn(self)

    def pick_question(self):
        available_questions = self.questions.filter(available=True)

        if available_questions.count() == 0:
            raise NoMoreQuestions

        self.current_question = random.choice(available_questions)
        self.current_question.available = False
        self.current_question.save()

    def deal_cards(self):
        for player in self.players.all():
            player.pick_card(self.choices)

    def get_propositions(self):
        if self.state != 'started':
            return None

        return self.answers.filter(question=self.current_question)

    def answer(self, choices, answered_by):
        question = self.current_question
        answered_question = AnsweredQuestion(game=self, question=question, answered_by=answered_by)
        answered_question.save()

        blanks = list(question.blanks.all())

        for i in range(len(choices)):
            choice = choices[i]

            answered_question.answers.create(position=blanks[i], choice=choice)

            choice.owner = None
            choice.played = True
            choice.save()

        events.answer_submitted(self, answered_by)

        if self.get_propositions().count() == self.players.count() - 1:
            answers = list(self.get_propositions())
            random.shuffle(answers)
            events.all_answers_submitted(self, answers)

        return answered_question

    def select_answer(self, selected, selected_by):
        winner = selected.answered_by

        selected.selected_by = selected_by
        selected.save()

        turns_count = self.turns.count()
        turn = GameTurn(
            number=turns_count + 1,
            game=self,
            question_master=self.question_master,
            winner=winner,
            question=self.current_question,
        )
        turn.save()

        for answer in self.get_propositions():
            answer.turn = turn
            answer.save()

        events.answer_selected(self, turn)


class GameTurn(models.Model):
    """
    GameTurn fields:
        - number: integer

    GameTurn relations:
        - game: Game
        - question_master: Player
        - winner: Player
        - question: Question
    """

    number = models.IntegerField()
    game = models.ForeignKey(Game, related_name='turns', on_delete=models.CASCADE)
    question_master = models.ForeignKey(Player, related_name='turns_as_question_master', on_delete=models.CASCADE)
    winner = models.ForeignKey(Player, related_name='turns_won', on_delete=models.CASCADE)
    question = models.OneToOneField('Question', related_name='turn', on_delete=models.CASCADE)


class Question(models.Model):
    """
    Question fields:
        - text: string
        - available: boolean

    Question relations:
        - game: Game
        - turn: GameTurn
        - current: Game
        - blanks: Blank[]
        - answered: AnsweredQuestion

    Question methods:
        - get_nb_choices() -> integer
        - get_filled_text(string) -> string
        - get_split_text() -> (string | None)[]
    """

    text = models.CharField(max_length=255)
    available = models.BooleanField(default=True)
    game = models.ForeignKey(Game, related_name='questions', on_delete=models.CASCADE)

    def __str__(self):
        return self.get_filled_text('...')

    def get_nb_choices(self):
        return self.blanks.count()

    def get_filled_text(self, blank):
        return ' '.join(map(lambda t: t.strip() if t else blank, self.get_split_text()))

    def get_split_text(self):
        text = self.text
        pos = list(map(lambda pos: pos.place, self.blanks.all()))

        if pos[0] is None:
            return [text]

        result = []
        last = 0

        if pos[0] == 0:
            result.append(None)
            pos = pos[1:]

        for p in pos:
            result.append(text[last:p])
            result.append(None)
            last = p

        result.append(text[last:])

        return result


class Choice(models.Model):
    """
    Choice fields:
        - text: string
        - available: boolean
        - played: boolean

    Choice relations:
        - game: Game
        - owner: Player
    """

    text = models.CharField(max_length=255)
    available = models.BooleanField(default=True)
    played = models.BooleanField(default=False)
    game = models.ForeignKey(Game, related_name='choices', on_delete=models.CASCADE)
    owner = models.ForeignKey(Player, related_name='cards', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.text


class Blank(models.Model):
    """
    Blank fields:
        - place: integer

    Blank relations:
        - question: Question
    """

    place = models.IntegerField(blank=True, null=True)
    question = models.ForeignKey(Question, related_name='blanks', on_delete=models.CASCADE)


class AnsweredQuestion(models.Model):
    """
    AnsweredQuestion relations:
        - game: Game
        - question: Question
        - answered_by: Player
        - selected_by: Player
        - answers: Answer[]

    AnsweredQuestion methods:
        - get_filled_text() -> string
        - get_split_text() -> string[]
    """

    game = models.ForeignKey(Game, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name='answered', on_delete=models.CASCADE)
    answered_by = models.ForeignKey(Player, related_name='answered_question', on_delete=models.CASCADE)
    selected_by = models.ForeignKey(Player, related_name='selected_cards', blank=True, null=True, on_delete=models.CASCADE)
    turn = models.ForeignKey(GameTurn, related_name='answers', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.get_filled_text()

    def get_filled_text(self):
        return ' '.join(map(lambda t: t.strip(), self.get_split_text()))

    def get_split_text(self):
        text = self.question.text
        answers = list(self.answers.all())

        if answers[0].position.place is None:
            return [str(answers[0])]

        result = []
        last = 0

        if answers[0].position.place == 0:
            result.append(str(answers[0]))
            answers = answers[1:]

        for answer in answers:
            place = answer.position.place
            result.append(text[last:place].strip())
            result.append(str(answer))
            last = place

        result.append(text[last:])

        return result


class Answer(models.Model):
    """
    Answer relations:
        - choice: Choice
        - position: Blank
        - question: Question
    """

    choice = models.OneToOneField(Choice, on_delete=models.CASCADE)
    position = models.ForeignKey(Blank, on_delete=models.CASCADE)
    question = models.ForeignKey(AnsweredQuestion, related_name='answers', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.choice)

    def get_place(self):
        idx = 0

        for blank in self.question.question.blanks.all():
            if blank == self.position:
                return idx

            idx += 1
