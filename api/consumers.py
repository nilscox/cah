import json

from api.models import Player


def on_connected(socket_id, data):
    if "nick" not in data:
        raise RuntimeError("Missing nick")

    try:
        player = Player.objects.get(nick=data["nick"])
        player.on_connected(socket_id)
    except Player.DoesNotExist:
        print("warn: Cannot find player with nick=" + data["nick"])


def on_disconnected(socket_id):
    try:
        player = Player.objects.get(socket_id=socket_id)
        player.on_disconnected()
    except Player.DoesNotExist:
        print("warn: Cannot find player with socket_id=" + socket_id)


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

    print(data)
    action = actions[data["action"]]

    try:
        response = action(str(message.reply_channel), data)
    except RuntimeError as e:
        response = {"error": str(e)}

    if response:
        message.reply_channel.send({"text": json.dumps(response)})


def ws_disconnect(message):
    on_disconnected(str(message.reply_channel))
