import json

from api.models import Player


def find_player(**kwargs):
    try:
        return Player.objects.get(**kwargs)
    except Player.DoesNotExist:
        raise RuntimeError("Cannot find player matching " + str(kwargs))


def on_connected(socket_id, data):
    if "nick" not in data:
        raise RuntimeError("Missing nick")

    player = find_player(nick=data["nick"])
    player.on_connected(socket_id)


def on_disconnected(socket_id):
    player = find_player(socket_id=socket_id)
    player.on_disconnected()


def ws_add(message):
    message.reply_channel.send({"accept": True})


def ws_message(message):
    data = json.loads(message.content["text"])
    actions = {
        "connected": on_connected,
    }

    if "action" not in data:
        raise RuntimeError("Missing action")

    if not data["action"] in actions:
        raise RuntimeError("Unknown action " + data["action"])

    action = actions[data["action"]]

    try:
        response = action(message.reply_channel, data)
    except RuntimeError as e:
        response = {"error": str(e)}

    if response:
        message.reply_channel.send({"text": json.dumps(response)})


def ws_disconnect(message):
    on_disconnected(message.reply_channel)
