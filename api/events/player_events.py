from .events import serialize, player_group, send, broadcast
from .events_processor import EventProcessor

class PlayerEvents(EventProcessor):

    def send(self, player, message):
        send(player.socket_id, message)

    def broadcast(self, game, message):
        broadcast("game-" + str(game.id), message)

    def on_player_connected(self, player):
        if player.in_game():
            player_group(player).add(player.socket_id)

            self.broadcast(player.game, {
                "type": "PLAYER_CONNECTED",
                "player": serialize("PlayerLightSerializer", player),
            })

    def on_player_disconnected(self, player):
        if player.in_game():
            player_group(player).discard(player.socket_id)

            self.broadcast(player.game, {
                "type": "PLAYER_DISCONNECTED",
                "nick": player.nick,
            })

    def on_game_created(self, owner):
        player_group(owner).add(owner.socket_id)

    def on_player_avatar_changed(self, player):
        if player.in_game():
            self.broadcast(player.game, {
                "type": "PLAYER_AVATAR_CHANGED",
                "player": serialize("PlayerLightSerializer", player),
            })

    def on_game_joined(self, player):
        if player.socket_id is not None:
            player_group(player).add(player.socket_id)

        self.broadcast(player.game, {
            "type": "PLAYER_JOINED",
            "player": serialize("PlayerLightSerializer", player),
        })

    def on_game_left(self, player):
        if player.socket_id is not None:
            player_group(player).discard(player.socket_id)

        self.broadcast(player.game, {
            "type": "PLAYER_LEFT",
            "player": serialize("PlayerLightSerializer", player),
        })

    def on_game_started(self, game):
        self.broadcast(game, {
            "type": "GAME_STARTED",
            "game": serialize("GameSerializer", game),
        })

    def on_next_turn(self, game):
        self.broadcast(game, {
            "type": "GAME_NEXT_TURN",
            "game": serialize("GameSerializer", game),
        })

    def on_cards_dealt(self, player, cards):
        self.send(player, {
            "type": "CARDS_DEALT",
            "cards": serialize("ChoiceSerializer", cards, many=True),
        })

    def on_answer_submitted(self, game, player):
        self.broadcast(game, {
            "type": "ANSWER_SUBMITTED",
            "nick": player.nick,
        })

    def on_all_answers_submitted(self, game, all_answers):
        self.broadcast(game, {
            "type": "ALL_ANSWERS_SUBMITTED",
            "answers": serialize("PartialAnsweredQuestionSerializer", all_answers, many=True),
        })

    def on_answer_selected(self, game, turn):
        self.broadcast(game, {
            "type": "ANSWER_SELECTED",
            "turn": serialize("GameTurnSerializer", turn),
        })
