from channels import Group


def serialize(serializer, *args, **kwargs):
    from api import serializers

    if not hasattr(serializers, serializer):
        raise RuntimeError("Cannot find serializer " + serializer)

    return getattr(serializers, serializer)(*args, **kwargs).data


def player_group(player):
    return Group("game-" + str(player.game.id))


def on_player_connected(player):
    if player.in_game():
        player_group(player).add(player.socket_id)

        player.game.broadcast({
            "type": "CONNECTED",
            "player": serialize("PlayerSerializer", player),
        })


def on_player_disconnected(player):
    if player.in_game():
        player_group(player).discard(player.socket_id)

        player.game.broadcast({
            "type": "DISCONNECTED",
            "player": serialize("PlayerSerializer", player),
        })


def on_game_created(player):
    player_group(player).add(player.socket_id)


def on_game_joined(player):
    player_group(player).add(player.socket_id)
    player.game.broadcast({
        "type": "JOINED",
        "player": serialize("PlayerSerializer", player),
    })


def on_game_left(player):
    player_group(player).discard(player.socket_id)
    player.game.broadcast({
        "type": "LEFT",
        "player": serialize("PlayerSerializer", player),
    })


def on_game_started(game):
    game.broadcast({
        "type": "GAME_STARTED",
        "game": serialize("GameSerializer", game),
    })


def on_cards_dealt(player, cards):
    player.send({
        "type": "CARDS_DEALT",
        "cards": serialize("ChoiceSerializer", cards, many=True),
    })


def on_answer_submitted(game, player):
    game.broadcast({
        "type": "ANSWER_SUBMITTED",
        "nick": player.nick,
    })


def on_all_answers_submitted(game, all_answers):
    game.broadcast({
        "type": "ALL_ANSWERS_SUBMITTED",
        "answers": serialize("AnsweredQuestionSerializer", all_answers, many=True),
    })


def on_answer_selected(game, answer, all_answers):
    game.broadcast({
        "type": "ANSWER_SELECTED",
        "answer": serialize("FullAnsweredQuestionSerializer", answer),
        "answers": serialize("FullAnsweredQuestionSerializer", all_answers, many=True),
    })


def on_next_turn(game):
    game.broadcast({
        "type": "NEXT_TURN",
        "game": serialize("GameSerializer", game),
    })
