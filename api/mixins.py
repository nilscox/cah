from rest_framework.response import Response

from api.events import on_event
from api.serializers import PlayerSerializer
from api.exceptions import *

class ChangeAvatarMixin(object):

    def change_avatar(self, request, player):
        if 'avatar' not in request.FILES:
            raise MissingFieldError('avatar')

        serializer = self.serializer_class(player, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        on_event('player_avatar_changed', player)

        return Response(serializer.data)

