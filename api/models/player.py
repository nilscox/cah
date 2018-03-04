import random

from django.core.exceptions import ObjectDoesNotExist
from django.db import models

from api import events
from api.exceptions import NoMoreChoices


class Player(models.Model):
    """
    Player fields:
        - nick: string
        - socket_id: string
        - avatar: string

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
    avatar = models.ImageField(upload_to='avatars', blank=True, null=True)
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
        except ObjectDoesNotExist:
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

