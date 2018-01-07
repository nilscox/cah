import json
from channels import Group

from api.models import Player
from api.serializers import PlayerSerializer


def player_group(player):
    if not player.game_id:
        return None

    return Group('game-' + str(player.game_id))


def broadcast(group, message):
    group.send({
        'text': json.dumps(message),
    })


def on_connected(socket_id, nick):
    try:
        player = Player.objects.get(nick=nick)
    except Player.DoesNotExist:
        return "Cannot find player with nick \"{0}\"".format(nick)

    player.socket_id = socket_id
    player.save()

    if player.in_game():
        group = player_group(player)

        group.add(socket_id)
        broadcast(group, {
            'type': 'connected',
            'player': PlayerSerializer(player).data,
        })


def on_disconnected(socket_id):
    try:
        player = Player.objects.get(socket_id=socket_id)
    except Player.DoesNotExist:
        return "Cannot find player with socket_id \"{0}\"".format(socket_id)

    player.socket_id = None
    player.save()

    if not player.in_game():
        return

    group = player_group(player)

    group.discard(socket_id)
    broadcast(group, {
        'type': 'disconnected',
        'player': PlayerSerializer(player).data,
    })


def on_create_game(player):
    return on_join_game(player)


def on_join_game(player):
    group = player_group(player)

    group.add(player.socket_id)
    broadcast(group, {
        'type': 'joined',
        'player': PlayerSerializer(player).data,
    })


def on_leave_game(player):
    group = player_group(player)

    group.discard(player.socket_id)
    broadcast(group, {
        'type': 'left',
        'player': PlayerSerializer(player).data,
    })
