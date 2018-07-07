from .events import serialize, player_group, send, broadcast
from .events_processor import EventProcessor

class AdminEvents(EventProcessor):

    def send(self, player, message):
        send(player.socket_id, message)

    def broadcast(self, message):
        broadcast("admin", message)

    def on_player_connected(self, player):
        self.broadcast({
            "type": "PLAYER_CONNECTED",
            "player": serialize("FullPlayerSerializer", player),
        })

    def on_player_disconnected(self, player):
        self.broadcast({
            "type": "PLAYER_DISCONNECTED",
            "player": serialize("FullPlayerSerializer", player),
        })

    def on_game_created(self, game):
        self.broadcast({
            "type": "GAME_CREATED",
            "game": serialize("FullGameSerializer", game),
        })

    def on_player_avatar_changed(self, player):
        self.broadcast({
            "type": "PLAYER_AVATAR_CHANGED",
            "player": serialize("FullPlayerSerializer", player),
        })

    def on_game_joined(self, player):
        self.broadcast({
            "type": "PLAYER_JOINED",
            "player": serialize("FullPlayerSerializer", player),
        })

    def on_game_left(self, player):
        self.broadcast(player.game, {
            "type": "PLAYER_LEFT",
            "player": serialize("FullPlayerSerializer", player),
        })

    def on_game_started(self, game):
        self.broadcast({
            "type": "GAME_STARTED",
            "game": serialize("FullGameSerializer", game),
        })

    def on_next_turn(self, game):
        self.broadcast({
            "type": "GAME_NEXT_TURN",
            "game": serialize("FullGameSerializer", game),
        })

    def on_cards_dealt(self, player, cards):
        self.broadcast({
            "type": "CARDS_DEALT",
            "player": serialize("FullPlayerSerializer", player),
        })

    def on_answer_submitted(self, game, player):
        self.broadcast({
            "type": "ANSWER_SUBMITTED",
            "game": serialize("FullGameSerializer", game),
        })

    def on_all_answers_submitted(self, game, all_answers):
        self.broadcast({
            "type": "ALL_ANSWERS_SUBMITTED",
            "game": serialize("FullGameSerializer", game)
        })

    def on_answer_selected(self, game, turn):
        self.broadcast({
            "type": "ANSWER_SELECTED",
            "turn": serialize("GameTurnSerializer", turn),
        })
