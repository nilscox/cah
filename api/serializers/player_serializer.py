from rest_framework import serializers
from api.models import Player
from .choice_serializer import ChoiceSerializer
from .answered_question_serializer import AnsweredQuestionSerializer


class PlayerSerializer(serializers.ModelSerializer):
    """
    Player: {
        nick: string,
        connected: boolean,
        avatar: string | null,
        score: integer,
        cards: Choice[],
        submitted: AnsweredQuestion | null,
    }
    """

    connected = serializers.SerializerMethodField()
    score = serializers.ReadOnlyField(source='get_score')
    cards = ChoiceSerializer(many=True, read_only=True)
    submitted = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ('nick', 'connected', 'avatar', 'score', 'cards', 'game', 'submitted')

    def get_connected(self, player):
        return bool(player.socket_id)

    def get_submitted(self, player):
        submitted = player.get_submitted()

        if submitted is None:
            return None

        return AnsweredQuestionSerializer(submitted).data


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
