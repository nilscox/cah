import json
from django.db import models


class Question(models.Model):
    """
    Question fields:
        - lang: string
        - text: string
        - blanks: integer[]
    """

    lang = models.CharField(max_length=8)
    text = models.CharField(max_length=255)
    blanks = models.CharField(max_length=255)

    def get_blanks(self):
        return json.loads(self.blanks)


class Choice(models.Model):
    """
    Choice fields:
        - lang: string
        - text: string
    """

    lang = models.CharField(max_length=8)
    text = models.CharField(max_length=255)
    keep_capitalization = models.BooleanField()

    def __str__(self):
        return self.text
