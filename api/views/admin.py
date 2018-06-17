from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from api.models import Game, Player
from api.serializers import GameSerializer, GameTurnSerializer, PlayerSerializer

class GameViewSet(viewsets.ModelViewSet):

  queryset = Game.objects.all()
  serializer_class = GameSerializer

  @action(detail=True)
  def history(self, request, pk=None):
    game = self.get_object()
    serializer = GameTurnSerializer(game.turns, many=True)

    return Response(serializer.data)


class PlayerViewSet(viewsets.ModelViewSet):

  queryset = Player.objects.all()
  serializer_class = PlayerSerializer
