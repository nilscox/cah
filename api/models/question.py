from django.db import models


class Question(models.Model):
    """
    Question fields:
        - lang: string
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

    lang = models.CharField(max_length=8)
    text = models.CharField(max_length=255)
    available = models.BooleanField(default=True)
    game = models.ForeignKey('Game', related_name='questions', on_delete=models.CASCADE)

    def __str__(self):
        return self.get_filled_text('...')

    def get_nb_choices(self):
        return max(1, self.blanks.count())

    def get_filled_text(self, blank):
        return ' '.join(map(lambda t: t.strip() if t else blank, self.get_split_text()))

    def get_split_text(self):
        text = self.text
        pos = list(map(lambda pos: pos.place, self.blanks.all()))

        if not pos:
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


class Blank(models.Model):
    """
    Blank fields:
        - place: integer

    Blank relations:
        - question: Question
    """

    place = models.IntegerField(blank=True, null=True)
    question = models.ForeignKey(Question, related_name='blanks', on_delete=models.CASCADE)
