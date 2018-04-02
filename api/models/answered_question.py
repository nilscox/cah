from django.db import models


class AnsweredQuestion(models.Model):
    """
    AnsweredQuestion fields:
        - place: integer

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

    class Meta:
        ordering = ['place']

    place = models.IntegerField(blank=True, null=True)
    game = models.ForeignKey('Game', related_name='answers', on_delete=models.CASCADE)
    question = models.ForeignKey('Question', related_name='answered', on_delete=models.CASCADE)
    answered_by = models.ForeignKey('Player', related_name='answered_question', on_delete=models.CASCADE)
    selected_by = models.ForeignKey('Player', related_name='selected_cards', blank=True, null=True, on_delete=models.CASCADE)
    turn = models.ForeignKey('GameTurn', related_name='answers', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.get_filled_text()

    def get_filled_text(self):
        return ' '.join(map(lambda t: t.strip(), self.get_split_text()))

    def get_split_text(self):
        text = self.question.text
        answers = self.answers.all()

        if answers[0].position is None:
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
