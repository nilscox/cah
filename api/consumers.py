import json

from api.events import on_connected, on_disconnected


def ws_add(message):
    message.reply_channel.send({"accept": True})


def ws_message(message):
    data = json.loads(message.content["text"])
    reply_channel = message.reply_channel
    response = None

    if data["action"] == "connected":
        response = on_connected(reply_channel, data["nick"])

    if response:
        reply_channel.send({"text": response})


def ws_disconnect(message):
    on_disconnected(message.reply_channel)
