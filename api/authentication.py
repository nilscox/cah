from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from api.models import Player


class PlayerAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        player_id = request.session.get('player_id')

        if not player_id:
            return None

        try:
            player = Player.objects.get(pk=player_id)
        except Player.DoesNotExist:
            raise AuthenticationFailed('No such player')

        return player, None
