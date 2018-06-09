from django.db import models


class Choice(models.Model):
    """
    Choice fields:
        - text: string
        - keep_capitalization: boolean
        - available: boolean
        - played: boolean

    Choice relations:
        - game: Game
        - owner: Player
    """

    text = models.CharField(max_length=255)
    keep_capitalization = models.BooleanField()
    available = models.BooleanField(default=True)
    played = models.BooleanField(default=False)
    game = models.ForeignKey('Game', related_name='choices', on_delete=models.CASCADE)
    owner = models.ForeignKey('Player', related_name='cards', blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        return self.text
