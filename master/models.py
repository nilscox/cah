import json
from django.db import models


class Question(models.Model):
    """
    Question fields:
        - text: string
        - blanks: integer[]
    """

    text = models.CharField(max_length=255)
    blanks = models.CharField(max_length=255)


class Choice(models.Model):
    """
    Choice fields:
        - text: string
    """

    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text