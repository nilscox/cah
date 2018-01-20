import json

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api import events
from api.models import Player, Game


@api_view(['POST'])
def ws_send(request, nick):
    data = json.loads(request.data.get('message'))

    try:
        player = Player.objects.get(nick=nick)
    except Player.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if not player.socket_id:
        return Response('Player is not connected', status=400)

    print('[DEBUG]', 'ws send -> ' + player.nick + ': ' + str(data))
    events.send(player, data)

    return Response()


@api_view(['POST'])
def ws_broadcast(request, pk):
    data = json.loads(request.data.get('message'))

    try:
        game = Game.objects.get(pk=pk)
    except Game.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    print('[DEBUG]', 'ws broadcast -> ' + str(game) + ': ' + str(data))
    events.broadcast(game, data)

    return Response()
