from rest_framework import views
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response

from api.models import Player
from api.authentication import PlayerAuthentication
from api.permissions import IsPlayer
from api.serializers import PlayerLightSerializer, PlayerSerializer
from api.exceptions import *

class PlayerViews(views.APIView):
    authentication_classes = [PlayerAuthentication]

    @staticmethod
    def serialize_player(player):
        serializer = PlayerSerializer if player.in_game() else PlayerLightSerializer
        return serializer(player).data

    def post(self, request, format=None):
        nick = request.data.get('nick')

        if not nick:
            raise ValidationError('Missing nick field')

        player, created = Player.objects.get_or_create(nick=nick)
        request.session['player_id'] = player.id

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK

        return Response(PlayerViews.serialize_player(player), status_code)

    def get(self, request, format=None):
        if not isinstance(request.user, Player):
            raise PlayerNotFound

        return Response(PlayerViews.serialize_player(request.user))

    def delete(self, request, format=None):
        if not isinstance(request.user, Player):
            raise PlayerNotFound

        del request.session['player_id']

        return Response(None, status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
@authentication_classes([PlayerAuthentication])
@permission_classes([IsPlayer])
def avatar(request):
    player = request.user

    if 'avatar' not in request.FILES:
        raise ValidationError('Missing avatar field')

    serializer = PlayerSerializer(player, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)

    serializer.save()

    events.player_avatar_changed(player)

    return Response(serializer.data)

