from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from api.exceptions import *
from api.models import Game, Player
from api.serializers import GameSerializer, GameTurnSerializer, FullPlayerSerializer
from api.authentication import AdminAuthentication

class GameViewSet(viewsets.ModelViewSet):

  authentication_classes = [AdminAuthentication]
  permission_classes = [IsAuthenticated]

  queryset = Game.objects.all()
  serializer_class = GameSerializer

  def create(self, request):
    owner_nick = request.data.get('owner')

    if not owner_nick:
      raise ValidationError('Missing owner field')
    try:
      owner = Player.objects.get(nick=owner_nick)
    except Player.DoesNotExist:
      raise PlayerNotFound

    if owner.in_game():
      raise PlayerAlreadyInGame

    serializer = GameSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    game = serializer.save(owner=owner)

    return Response(serializer.data, status=status.HTTP_201_CREATED)

  @action(detail=True)
  def history(self, request, pk=None):
    game = self.get_object()
    serializer = GameTurnSerializer(game.turns, many=True)

    return Response(serializer.data)


class PlayerViewSet(viewsets.ModelViewSet):

  authentication_classes = [AdminAuthentication]
  permission_classes = [IsAuthenticated]

  queryset = Player.objects.all()
  serializer_class = FullPlayerSerializer
  lookup_field = 'nick'
