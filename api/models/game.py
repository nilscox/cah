import random

from django.db import models

from api.events import on_event
from api.exceptions import NoMoreQuestions

GAME_STATES = (
    ('idle', 'idle'),
    ('started', 'started'),
    ('finished', 'finished'),
)


class Game(models.Model):
    """
    Game fields:
        - lang: string
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
        - get_history() -> GameTurn[]
        - add_player(player) -> None
        - remove_player(player) -> None
        - pick_question() -> None
        - deal_cards() -> None
        - get_propositions() -> AnsweredQuestion[] | None
    """

    lang = models.CharField(max_length=8)
    state = models.CharField(max_length=8, default='idle', choices=GAME_STATES)
    owner = models.ForeignKey('Player', related_name='owns', on_delete=models.CASCADE)
    question_master = models.ForeignKey('Player', blank=True, null=True, related_name='question_master_of', on_delete=models.CASCADE)
    current_question = models.ForeignKey('Question', blank=True, null=True, related_name='current', on_delete=models.CASCADE)

    def __str__(self):
        return ''.join(['Game #', str(self.id), ' (', self.state, ')'])

    def get_history(self):
        return self.turns.all()

    def add_player(self, player):
        self.players.add(player)
        on_event('game_joined', player)

    def remove_player(self, player):
        on_event('game_left', player)
        self.players.remove(player)

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
    question_master = models.ForeignKey('Player', related_name='turns_as_question_master', on_delete=models.CASCADE)
    winner = models.ForeignKey('Player', related_name='turns_won', on_delete=models.CASCADE)
    question = models.OneToOneField('Question', related_name='turn', on_delete=models.CASCADE)
