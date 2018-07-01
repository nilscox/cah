from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

from api.exceptions import *
from api.models import Game, Player
from api.serializers import GameSerializer, GameTurnSerializer, FullPlayerSerializer
from api.authentication import AdminAuthentication
from api.mixins import ChangeAvatarMixin

class GameViewSet(viewsets.ModelViewSet):

    authentication_classes = [AdminAuthentication]
    permission_classes = [IsAdminUser]

    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def create(self, request):
        owner_nick = request.data.get('owner')

        if not owner_nick:
            raise MissingFieldError('owner')
        try:
            owner = Player.objects.get(nick=owner_nick)
        except Player.DoesNotExist:
            raise PlayerNotFound

        if owner.in_game():
            raise PlayerAlreadyInGame

        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        game = serializer.save(owner=owner, players=[owner])

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True)
    def history(self, request, pk=None):
        game = self.get_object()
        serializer = GameTurnSerializer(game.turns, many=True)

        return Response(serializer.data)

    @action(methods=['POST'], detail=True)
    def join(self, request, pk=None):
        game = self.get_object()
        nick = request.data.get('player')

        if not nick:
            raise MissingFieldError('player')

        try:
            player = Player.objects.get(nick=nick)
        except Player.DoesNotExist:
            raise PlayerNotFound()

        if player.in_game():
            raise PlayerAlreadyInGame

        if game.state != 'idle':
            raise GameAlreadyStarted

        game.add_player(player)

        return Response(GameSerializer(game).data)

    @action(methods=['POST'], detail=True)
    def leave(self, request, pk=None):
        game = self.get_object()
        nick = request.data.get('player')

        if not nick:
            raise MissingFieldError('player')

        try:
            player = Player.objects.get(nick=nick)
        except Player.DoesNotExist:
            raise PlayerNotFound()

        if not player.in_game(game):
            raise PlayerNotInGame

        game.remove_player(player)

        return Response(None, status.HTTP_204_NO_CONTENT)


class PlayerViewSet(viewsets.ModelViewSet, ChangeAvatarMixin):

    authentication_classes = [AdminAuthentication]
    permission_classes = [IsAdminUser]

    queryset = Player.objects.all()
    serializer_class = FullPlayerSerializer
    lookup_field = 'nick'

    @action(methods=['POST'], detail=True)
    def avatar(self, request, nick=None):
        return self.change_avatar(request, self.get_object())
