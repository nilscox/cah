import json

from channels import Channel, Group


def serialize(serializer, *args, **kwargs):
    from api import serializers

    if not hasattr(serializers, serializer):
        raise RuntimeError("Cannot find serializer " + serializer)

    return getattr(serializers, serializer)(*args, **kwargs).data


def player_group(player):
    return Group("game-" + str(player.game.id))


def send(socket_id, message):
    text = json.dumps(message)
    print("send: " + str(socket_id) + ": " + text)
    Channel(socket_id).send({ "text": text })


def broadcast(group, message):
    text = json.dumps(message)
    print("broadcast: " + group + ": " + text)
    Group(group).send({ "text": text })
