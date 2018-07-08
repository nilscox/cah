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
            "nick": player.nick,
        })

    def on_player_disconnected(self, player):
        self.broadcast({
            "type": "PLAYER_DISCONNECTED",
            "nick": player.nick,
        })

    def on_player_avatar_changed(self, player):
        self.broadcast({
            "type": "PLAYER_AVATAR_CHANGED",
            "nick": player.nick,
            "avatar": player.avatar,
        })

    def on_cards_dealt(self, player, cards):
        self.broadcast({
            "type": "PLAYER_CARDS_DEALT",
            "nick": player.nick,
            "cards": serialize("ChoiceSerializer", cards),
        })

    def on_game_created(self, game):
        self.broadcast({
            "type": "GAME_CREATED",
            "game": serialize("FullGameSerializer", game),
        })

    def on_game_joined(self, player):
        self.broadcast({
            "type": "GAME_PLAYER_JOINED",
            "nick": player.nick,
            "gameId": player.game.id,
        })

    def on_game_left(self, player):
        self.broadcast(player.game, {
            "type": "GAME_PLAYER_LEFT",
            "nick": player.nick,
            "gameId": player.game.id,
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

    def on_answer_submitted(self, game, player, answer):
        self.broadcast({
            "type": "GAME_ANSWER_SUBMITTED",
            "nick": player.nick,
            "gameId": game.id,
            "answer": serialize("AnsweredQuestionSerializer", answer),
        })

    def on_all_answers_submitted(self, game, all_answers):
        self.broadcast({
            "type": "GAME_ALL_ANSWERS_SUBMITTED",
            "gameId": game.id,
        })

    def on_answer_selected(self, game, turn):
        self.broadcast({
            "type": "GAME_ANSWER_SELECTED",
            "gameId": game.id,
            "turn": serialize("GameTurnSerializer", turn),
        })
