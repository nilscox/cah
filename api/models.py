import random

from django.db import models

from api import data

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
        - is_in_game(Game=None) -> boolean
        - has_played() -> boolean | None
        - has_cards(int[]) -> boolean
        - get_score(Game=None) -> integer | None
        - win_card(AnsweredQuestion) -> None
    """

    nick = models.CharField(max_length=255, unique=True)
    game = models.ForeignKey('Game', related_name='players', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.nick

    def in_game(self, game=None):
        if game is None:
            game = self.game

        return game is not None

    def is_owner(self, game):
        return self.game is not None and self.game == game

    def has_played(self):
        if self.game is None:
            return None

        return bool(self.game.answers.filter(question=self.game.current_question, answered_by=self))

    def has_cards(self, choice_ids):
        return self.cards.filter(pk__in=choice_ids).count() == len(choice_ids)

    def win_card(self, answered_question):
        return self.won_cards.add(answered_question)

    def get_score(self, game=None):
        if game is None:
            game = self.game

        if game is None or game.state == 'idle':
            return None

        return self.won_cards.filter(game=game).count()


class Game(models.Model):
    """
    Game fields:
        - state: string

    Game relations:
        - owner: Player
        - players: Player[]
        - player_scores: PlayerScore[]
        - current_player: Player
        - questions: Question[]
        - current_question: Question
        - choices: Choice[]
        - answers: AnsweredQuestion[]

    Game methods:
        - start() -> None
        - next_turn() -> None
        - deal_cards() -> None
        - get_current_answers() -> AnsweredQuestion[] | None
    """

    state = models.CharField(max_length=8, default='idle', choices=GAME_STATES)
    owner = models.ForeignKey(Player, related_name='owns', on_delete=models.CASCADE)
    current_player = models.ForeignKey(Player, blank=True, null=True, related_name='current_of', on_delete=models.CASCADE)
    current_question = models.ForeignKey('Question', blank=True, null=True, related_name='current', on_delete=models.CASCADE)

    def __str__(self):
        return ''.join(['Game #', str(self.id), ' (', self.state, ')'])

    def start(self):
        questions, places = data.get_questions()

        questions = list(map(lambda text: Question(game=self, text=text), questions))
        Question.objects.bulk_create(questions)

        questions = list(self.questions.all())
        choices_positions = []

        for i in range(len(questions)):
            for place in places[i]:
                choices_positions.append(ChoicePosition(place=place, question=questions[i]))

        ChoicePosition.objects.bulk_create(choices_positions)

        choices = data.get_choices()
        choices = map(lambda text: Choice(game=self, text=text), choices)
        self.choices.bulk_create(choices)

        self.state = 'started'
        self.next_turn(random.choice(self.players.all()))

        self.save()

    def next_turn(self, player):
        self.current_player = player

        for player in self.players.all():
            self.deal_cards(player)

        self.current_question = random.choice(self.questions.filter(selected=False))
        self.current_question.selected = True
        self.current_question.save()

        self.save()

    def deal_cards(self, player):
        choices = list(self.choices.filter(selected=False))

        for i in range(11 - player.cards.count()):
            choice = random.choice(choices)
            choice.selected = True
            choice.save()

            player.cards.add(choice)
            choices.remove(choice)


class Question(models.Model):
    """
    Question fields:
        - text: string
        - selected: boolean

    Question relations:
        - game: Game
        - current: Game
        - choices_positions: ChoicePosition[]
        - answered: AnsweredQuestion

    Question methods:
        - get_nb_choices() -> integer
        - get_filled_text() -> string
    """

    text = models.CharField(max_length=255)
    selected = models.BooleanField(default=False)
    game = models.ForeignKey(Game, related_name='questions', on_delete=models.CASCADE)

    def __str__(self):
        return self.get_filled_text()

    def get_nb_choices(self):
        return len(self.choices_positions.all())

    def get_filled_text(self):
        text = self.text
        offset = 0

        for pos in self.choices_positions.all():
            if pos.place is None:
                break
            place = pos.place + offset
            offset += 3
            text = text[:place] + '...' + text[place:]

        return text


class Choice(models.Model):
    """
    Choice fields:
        - text: string
        - selected: boolean

    Choice relations:
        - game: Game
        - owner: Player
    """

    text = models.CharField(max_length=255)
    selected = models.BooleanField(default=False)
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
    question = models.OneToOneField(Question, related_name='answered', on_delete=models.CASCADE)
    answered_by = models.ForeignKey(Player, related_name='answered_question', on_delete=models.CASCADE)
    won_by = models.ForeignKey(Player, related_name='won_cards', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.get_filled_text()

    def get_filled_text(self):
        text = self.question.text
        offset = 0

        for answer in self.answers.all():
            if answer.position.place is None:
                continue

            answer_text = answer.choice.text
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
    position = models.OneToOneField(ChoicePosition, on_delete=models.CASCADE)
    question = models.ForeignKey(AnsweredQuestion, related_name='answers', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.choice)
