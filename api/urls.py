from django.urls import path, include
from rest_framework.routers import DefaultRouter

from api.views import base, game, player, admin, debug

adminRouter = DefaultRouter()
adminRouter.register(r'game', admin.GameViewSet)
adminRouter.register(r'player', admin.PlayerViewSet)

urlpatterns = [
    path('', base.root),
    path('version', base.version),

    path('player', player.PlayerViews.as_view()),
    path('player/avatar', player.avatar),

    path('game', game.GameViews.as_view()),
    path('game/history', game.game_history),
    path('game/join/<int:pk>', game.join_game),
    path('game/leave', game.leave_game),
    path('game/start', game.start_game),
    path('game/next', game.next_turn),
    path('answer', game.answer),
    path('answer/select/<int:pk>', game.select),

    path('admin/', include(adminRouter.urls)),

    path('debug/ws_send/<nick>', debug.ws_send),
    path('debug/ws_broadcast/<int:pk>', debug.ws_broadcast),
]
