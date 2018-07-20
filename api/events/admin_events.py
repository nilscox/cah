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

    def on_game_joined(self, game, player):
        self.broadcast({
            "type": "GAME_PLAYER_JOINED",
            "game": FullGameSerializer(game).data,
            "nick": player.nick,
        })

    def on_game_left(self, game, player):
        self.broadcast(player.game, {
            "type": "GAME_PLAYER_LEFT",
            "game": FullGameSerializer(game).data,
            "nick": player.nick,
        })

    def on_game_started(self, game):
        self.broadcast({
            "type": "GAME_STARTED",
            "game": serialize("FullGameSerializer", game),
        })

    def on_next_turn(self, game):
        self.broadcast({
            "type": "GAME_NEXT_TURN",
            "game": serialize("FulllGameSerializer", game),
        })

    def on_cards_dealt(self, player, cards):
        self.send({
            "type": "CARDS_DEALT",
            "cards": serialize("FullChoiceSerializer", cards, many=True),
        })

    def on_answer_submitted(self, game, player):
        self.broadcast({
            "type": "GAME_ANSWER_SUBMITTED",
            "game": FullGameSerializer(game.id),
            "answer": AnsweredQuestionSerializer(answer).data,
            "nick": player.nick,
        })

    def on_all_answers_submitted(self, game, all_answers):
        self.broadcast({
            "type": "GAME_ALL_ANSWERS_SUBMITTED",
            "game": FullGameSerializer(game.id),
        })

    def on_answer_selected(self, game, turn):
        self.broadcast({
            "type": "GAME_ANSWER_SELECTED",
            "game": FullGameSerializer(game.id),
            "turn": GameTurnSerializer(turn).data,
        })
