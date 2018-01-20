from channels import Group


def serialize(serializer, *args, **kwargs):
    from api import serializers

    if not hasattr(serializers, serializer):
        raise RuntimeError("Cannot find serializer " + serializer)

    return getattr(serializers, serializer)(*args, **kwargs).data


def player_group(player):
    return Group("game-" + str(player.game.id))


def player_connected(player):
    if player.in_game():
        player_group(player).add(player.socket_id)

        player.game.broadcast({
            "type": "CONNECTED",
            "player": serialize("PlayerSerializer", player),
        })


def player_disconnected(player):
    if player.in_game():
        player_group(player).discard(player.socket_id)

        player.game.broadcast({
            "type": "DISCONNECTED",
            "nick": player.nick,
        })


def game_created(owner):
    player_group(owner).add(owner.socket_id)


def game_joined(player):
    player_group(player).add(player.socket_id)
    player.game.broadcast({
        "type": "JOINED",
        "player": serialize("PlayerSerializer", player),
    })


def game_left(player):
    player_group(player).discard(player.socket_id)
    player.game.broadcast({
        "type": "LEFT",
        "player": serialize("PlayerSerializer", player),
    })


def game_started(game):
    game.broadcast({
        "type": "GAME_STARTED",
        "game": serialize("GameSerializer", game),
    })


def cards_dealt(player, cards):
    player.send({
        "type": "CARDS_DEALT",
        "cards": serialize("ChoiceSerializer", cards, many=True),
    })


def answer_submitted(game, player):
    game.broadcast({
        "type": "ANSWER_SUBMITTED",
        "nick": player.nick,
    })


def all_answers_submitted(game, all_answers):
    game.broadcast({
        "type": "ALL_ANSWERS_SUBMITTED",
        "answers": serialize("AnsweredQuestionSerializer", all_answers, many=True),
    })


def answer_selected(game, answer, all_answers):
    game.broadcast({
        "type": "ANSWER_SELECTED",
        "answer": serialize("FullAnsweredQuestionSerializer", answer),
        "answers": serialize("FullAnsweredQuestionSerializer", all_answers, many=True),
    })


def next_turn(game):
    game.broadcast({
        "type": "NEXT_TURN",
        "game": serialize("GameSerializer", game),
    })
