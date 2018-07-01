import os

from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from api.models import Player


CAH_API_ADMIN_TOKEN = os.environ['CAH_API_ADMIN_TOKEN']


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


class AdminUser:
    def __init__(self):
        self.is_authenticated = True
        self.is_staff = True


class AdminAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        if request.META.get('HTTP_AUTHORIZATION') != CAH_API_ADMIN_TOKEN:
            return None

        return AdminUser(), None
