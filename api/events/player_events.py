from .events import player_group, send, broadcast
from .events_processor import EventProcessor
from api.serializers import PlayerLightSerializer, \
    ChoiceSerializer, \
    GameSerializer, \
    GameTurnSerializer, \
    PartialAnsweredQuestionSerializer

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
                "player": PlayerLightSerializer(player).data,
            })

    def on_player_disconnected(self, player):
        if player.in_game():
            player_group(player).discard(player.socket_id)

            self.broadcast(player.game, {
                "type": "PLAYER_DISCONNECTED",
                "nick": player.nick,
            })

    def on_game_created(self, game):
        owner = game.owner

        if owner.socket_id:
            player_group(owner).add(owner.socket_id)

    def on_player_avatar_changed(self, player):
        if player.in_game():
            self.broadcast(player.game, {
                "type": "PLAYER_AVATAR_CHANGED",
                "player": PlayerLightSerializer(player).data,
            })

    def on_game_joined(self, player):
        if player.socket_id is not None:
            player_group(player).add(player.socket_id)

        self.broadcast(player.game, {
            "type": "PLAYER_JOINED",
            "player": PlayerLightSerializer(player).data,
        })

    def on_game_left(self, player):
        if player.socket_id is not None:
            player_group(player).discard(player.socket_id)

        self.broadcast(player.game, {
            "type": "PLAYER_LEFT",
            "player": PlayerLightSerializer(player).data,
        })

    def on_game_started(self, game):
        self.broadcast(game, {
            "type": "GAME_STARTED",
            "game": GameSerializer(game).data,
        })

    def on_next_turn(self, game):
        self.broadcast(game, {
            "type": "GAME_NEXT_TURN",
            "game": GameSerializer(game).data,
        })

    def on_cards_dealt(self, player, cards):
        self.send(player, {
            "type": "CARDS_DEALT",
            "cards": ChoiceSerializer(cards, many=True).data,
        })

    def on_answer_submitted(self, game, player, answer):
        self.broadcast(game, {
            "type": "ANSWER_SUBMITTED",
            "nick": player.nick,
        })

    def on_all_answers_submitted(self, game, all_answers):
        self.broadcast(game, {
            "type": "ALL_ANSWERS_SUBMITTED",
            "answers": PartialAnsweredQuestionSerializer(all_answers, many=True).data,
        })

    def on_answer_selected(self, game, turn):
        self.broadcast(game, {
            "type": "ANSWER_SELECTED",
            "turn": GameTurnSerializer(turn).data,
        })
