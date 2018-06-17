from rest_framework import viewsets
from rest_framework.response import Response

from api.models import Game, Player
from api.serializers import GameSerializer, PlayerSerializer

class GameViewSet(viewsets.ModelViewSet):

  queryset = Game.objects.all()
  serializer_class = GameSerializer


class PlayerViewSet(viewsets.ModelViewSet):

  queryset = Player.objects.all()
  serializer_class = PlayerSerializer
