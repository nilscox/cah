from channels import Group


def serialize(serializer, *args, **kwargs):
    from api import serializers

    if not hasattr(serializers, serializer):
        raise RuntimeError("Cannot find serializer " + serializer)

    return getattr(serializers, serializer)(*args, **kwargs).data


def player_group(player):
    return Group("game-" + str(player.game.id))


def on_player_connected(player):
    player_group(player).add(player.socket_id)

    if player.in_game():
        player.game.broadcast({
            "type": "connected",
            "player": serialize("PlayerSerializer", player),
        })


def on_player_disconnected(player):
    player_group(player).discard(player.socket_id)

    if player.in_game():
        player.game.broadcast({
            "type": "disconnected",
            "player": serialize("PlayerSerializer", player),
        })


def on_game_created(player):
    player_group(player).add(player.socket_id)


def on_game_joined(player):
    player_group(player).add(player.socket_id)
    player.game.broadcast({
        "type": "connected",
        "player": serialize("PlayerSerializer", player),
    })


def on_game_left(player):
    player_group(player).discard(player.socket_id)
    player.game.broadcast({
        "type": "disconnected",
        "player": serialize("PlayerSerializer", player),
    })
