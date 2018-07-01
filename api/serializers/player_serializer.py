from rest_framework import serializers
from api.models import Player
from .choice_serializer import ChoiceSerializer
from .answered_question_serializer import AnsweredQuestionSerializer

class FullPlayerSerializer(serializers.ModelSerializer):
    """
    FullPlayer: {
        nick: string,
        socketId: string | null,
        avatar: string | null,
        connected: boolean,
        inGame: boolean,
        gameId: number | null,
        score: integer | null,
        cards: Choice[],
        hasPlayed: boolean,
        submitted: AnsweredQuestion | null,
    }
    """

    socketId = serializers.ReadOnlyField(source='socket_id')
    connected = serializers.SerializerMethodField()
    score = serializers.ReadOnlyField(source='get_score')
    inGame = serializers.ReadOnlyField(source='in_game')
    gameId = serializers.ReadOnlyField(source='game.id')
    cards = ChoiceSerializer(many=True, read_only=True)
    hasPlayed = serializers.ReadOnlyField(source='has_played')
    submitted = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = (
            'nick',
            'socketId',
            'avatar',
            'connected',
            'inGame',
            'gameId',
            'score',
            'cards',
            'hasPlayed',
            'submitted',
        )

    def get_connected(self, player):
        return bool(player.socket_id)

    def get_submitted(self, player):
        submitted = player.get_submitted()

        if submitted is None:
            return None

        return AnsweredQuestionSerializer(submitted).data


class PlayerSerializer(FullPlayerSerializer):
    """
    Player: {
        nick: string,
        connected: boolean,
        avatar: string | null,
        score: integer | null,
        cards: Choice[],
        submitted: AnsweredQuestion | null,
    }
    """

    class Meta:
        model = Player
        fields = ('nick', 'connected', 'avatar', 'score', 'cards', 'submitted')


class PlayerLightSerializer(PlayerSerializer):
    """
    PlayerLight: {
        nick: string,
        connected: boolean,
        avatar: string | null,
        score: integer,
    }
    """

    class Meta:
        model = Player
        fields = ('nick', 'connected', 'avatar', 'score')
