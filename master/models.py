from django.db import models


class Question(models.Model):
    """
    Question fields:
        - text: string

    Question relations:
        - blanks: Blank[]
    """

    text = models.CharField(max_length=255)


class Blank(models.Model):
    """
    Blank fields:
        - place: integer

    Blank relations:
        - question: Question
    """

    place = models.IntegerField(blank=True, null=True)
    question = models.ForeignKey(Question, related_name='blanks', on_delete=models.CASCADE)


class Choice(models.Model):
    """
    Choice fields:
        - text: string
    """

    text = models.CharField(max_length=255)
