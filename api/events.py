import json

from channels import Channel, Group


def serialize(serializer, *args, **kwargs):
    from api import serializers

    if not hasattr(serializers, serializer):
        raise RuntimeError("Cannot find serializer " + serializer)

    return getattr(serializers, serializer)(*args, **kwargs).data


def player_group(player):
    return Group("game-" + str(player.game.id))


def broadcast(game, message):
    text = json.dumps(message)
    print("broadcast: game-" + str(game.id) + ": " + text)
    Group("game-" + str(game.id)).send({"text": text})


def send(player, message):
    text = json.dumps(message)
    print("send: " + str(player) + ": " + text)
    Channel(player.socket_id).send({"text": text})


def player_connected(player):
    if player.in_game():
        player_group(player).add(player.socket_id)

        broadcast(player.game, {
            "type": "CONNECTED",
            "player": serialize("PlayerSerializer", player),
        })


def player_disconnected(player):
    if player.in_game():
        player_group(player).discard(player.socket_id)

        broadcast(player.game, {
            "type": "DISCONNECTED",
            "nick": player.nick,
        })


def game_created(owner):
    player_group(owner).add(owner.socket_id)


def game_joined(player):
    player_group(player).add(player.socket_id)
    broadcast(player.game, {
        "type": "JOINED",
        "player": serialize("PlayerSerializer", player),
    })


def game_left(player):
    player_group(player).discard(player.socket_id)
    broadcast(player.game, {
        "type": "LEFT",
        "player": serialize("PlayerSerializer", player),
    })


def game_started(game):
    broadcast(game, {
        "type": "GAME_STARTED",
        "game": serialize("GameSerializer", game),
    })


def cards_dealt(player, cards):
    send(player, {
        "type": "CARDS_DEALT",
        "cards": serialize("ChoiceSerializer", cards, many=True),
    })


def answer_submitted(game, player):
    broadcast(game, {
        "type": "ANSWER_SUBMITTED",
        "nick": player.nick,
    })


def all_answers_submitted(game, all_answers):
    broadcast(game, {
        "type": "ALL_ANSWERS_SUBMITTED",
        "answers": serialize("PartialAnsweredQuestionSerializer", all_answers, many=True),
    })


def answer_selected(game, answer, all_answers):
    broadcast(game, {
        "type": "ANSWER_SELECTED",
        "answer": serialize("AnsweredQuestionSerializer", answer),
        "answers": serialize("AnsweredQuestionSerializer", all_answers, many=True),
    })


def next_turn(game):
    broadcast(game, {
        "type": "NEXT_TURN",
        "game": serialize("GameSerializer", game),
    })
