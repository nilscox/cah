from rest_framework import permissions

from api.models import Player


class IsPlayer(permissions.BasePermission):

    def has_permission(self, request, view):
        return isinstance(request.user, Player)
