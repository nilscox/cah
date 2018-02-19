from django.db import models


class Answer(models.Model):
    """
    Answer relations:
        - choice: Choice
        - position: Blank
        - question: Question
    """

    choice = models.OneToOneField('Choice', on_delete=models.CASCADE)
    position = models.ForeignKey('Blank', on_delete=models.CASCADE)
    question = models.ForeignKey('AnsweredQuestion', related_name='answers', on_delete=models.CASCADE)

    def __str__(self):
        return str(self.choice)

    def get_place(self):
        idx = 0

        for blank in self.question.question.blanks.all():
            if blank == self.position:
                return idx

            idx += 1
