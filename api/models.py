import random

from django.db import models

from api import data
from api.exceptions import *

GAME_STATES = (
    ('idle', 'idle'),
    ('started', 'started'),
    ('finished', 'finished'),
)


class Player(models.Model):
    """
    Player fields:
        - nick: string

    Player relations:
        - game: Game
        - owns: Game
        - scores: PlayerScore[]
        - current_of: Game
        - cards: Choice[]
        - questions_answered: AnsweredQuestion[]
        - won_cards: AnsweredQuestion[]

    Player methods:
        - in_game(Game=None) -> boolean
        - is_owner(Game) -> boolean
        - has_played() -> boolean | None
        - has_cards(integer[]) -> boolean
        - get_score(Game=None) -> integer | None
        - win_card(AnsweredQuestion) -> None
        - get_submitted() -> AnsweredQuestion
    """

    nick = models.CharField(max_length=255, unique=True)
    game = models.ForeignKey('Game', related_name='players', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.nick

    def in_game(self, game=None):
        if game is not None:
            return game == self.game

        return self.game is not None

    def is_owner(self, game):
        return game.owner === self

    def has_played(self):
        if self.game is None:
            return None

        return self.get_submitted() is not None

    def has_cards(self, choice_ids):
        return self.cards.filter(pk__in=choice_ids).count() == len(choice_ids)

    def win_card(self, answered_question):
        return self.won_cards.add(answered_question)

    def get_score(self):
        if self.game is None:
            return None

        if game.state == 'idle':
            return 0

        return self.won_cards.filter(game=game).count()

    def get_submitted(self):
        if self.game is None:
            return None

        try:
            return self.game.answers.get(question=self.game.current_question, answered_by=self)
        except AnsweredQuestion.DoesNotExist:
            return None


class Game(models.Model):
    """
    Game fields:
        - state: string

    Game relations:
        - owner: Player
        - players: Player[]
        - current_player: Player
        - questions: Question[]
        - current_question: Question
        - choices: Choice[]
        - answers: AnsweredQuestion[]

    Game methods:
        - init() -> None
        - start() -> None
        - next_turn(player) -> None
        - deal_cards() -> None
        - get_propositions() -> AnsweredQuestion[] | None
    """

    state = models.CharField(max_length=8, default='idle', choices=GAME_STATES)
    owner = models.ForeignKey(Player, related_name='owns', on_delete=models.CASCADE)
    current_player = models.ForeignKey(Player, blank=True, null=True, related_name='current_of', on_delete=models.CASCADE)
    current_question = models.ForeignKey('Question', blank=True, null=True, related_name='current', on_delete=models.CASCADE)

    def __str__(self):
        return ''.join(['Game #', str(self.id), ' (', self.state, ')'])

    def init(self):
        def create_questions():
            questions, places = data.get_questions()

            questions = list(map(lambda text: Question(game=self, text=text), questions))
            Question.objects.bulk_create(questions)

        def create_choices_positions():
            questions = list(self.questions.all())
            choices_positions = []

            for i in range(len(questions)):
                for place in places[i]:
                    choices_positions.append(ChoicePosition(question=questions[i]), place=place)

            ChoicePosition.objects.bulk_create(choices_positions)

        def create_choices():
            choices = data.get_choices()

            choices = map(lambda text: Choice(game=self, text=text), choices)
            Choice.objects.bulk_create(choices)

        create_questions()
        create_choices_positions()
        create_choices()

    def start():
        if self.players.count() < 3:
            raise NotEnoughPlayers

        self.state = 'started'
        self.next_turn(random.choice(self.players.all()))
        self.save()

    def next_turn(self, player):
        self.current_player = player

        for player in self.players.all():
            self.deal_cards(player)

        available_questions = self.questions.filter(available=True)

        if available_questions.count() == 0:
            raise NoMoreQuestions

        self.current_question = random.choice(available_questions)
        self.current_question.available = False
        self.current_question.save()

    def deal_cards(self, player):
        choices = list(self.choices.filter(available=True))

        for i in range(11 - player.cards.count()):
            if len(choices) == 0:
                raise NoMoreChoices

            choice = random.choice(choices)
            choice.available = False
            choice.save()

            player.cards.add(choice)
            choices.remove(choice)

    def get_propositions(self):
        if self.state != 'started':
            return None

        return self.answers.filter(question=self.current_question)


class Question(models.Model):
    """
    Question fields:
        - text: string
        - available: boolean

    Question relations:
        - game: Game
        - current: Game
        - choices_positions: ChoicePosition[]
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
        return self.choices_positions.count()

    def get_filled_text(self, blank):
        return ' '.join(map(lambda t: t if t else blank, self.get_text_as_array()))

    def get_split_text(self):
        result = []
        last = None

        for pos in self.choices_positions.all():
            if pos.place is None:
                return [self.text, None]

            result.append(self.text[last:pos.place])
            last = pos.place

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


class ChoicePosition(models.Model):
    """
    ChoicePosition fields:
        - place: integer

    ChoicePosition relations:
        - question: Question
    """

    place = models.IntegerField(blank=True, null=True)
    question = models.ForeignKey(Question, related_name='choices_positions', on_delete=models.CASCADE)


class AnsweredQuestion(models.Model):
    """
    AnsweredQuestion relations:
        - game: Game
        - question: Question
        - answered_by: Player
        - won_by: Player
        - answers: Answer[]

    AnsweredQuestion methods:
        - get_filled_text() -> string
    """

    game = models.ForeignKey(Game, related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, related_name='answered', on_delete=models.CASCADE)
    answered_by = models.ForeignKey(Player, related_name='answered_question', on_delete=models.CASCADE)
    won_by = models.ForeignKey(Player, related_name='won_cards', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.get_filled_text()

    def get_filled_text(self):
        text = self.question.text
        offset = 0

        for answer in self.answers.all():
            answer_text = answer.choice.text

            if answer.position.place is None:
                text += ' ' + answer_text
                continue

            place = answer.position.place + offset
            offset += len(answer_text)
            text = text[:place] + answer_text + text[place:]

        return text


class Answer(models.Model):
    """
    Answer relations:
        - choice: Choice
        - position: ChoicePosition
        - question: Question
    """

    choice = models.OneToOneField(Choice, on_delete=models.CASCADE)
    position = models.ForeignKey(ChoicePosition, on_delete=models.CASCADE)
    question = models.ForeignKey(AnsweredQuestion, related_name='answers', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.choice)
