from rest_framework import permissions

from api.models import Player


class IsPlayer(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return isinstance(request.user, Player)
