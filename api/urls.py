from django.urls import path

from api import views
from api import views_debug

urlpatterns = [
    path('', views.root),
    path('player', views.PlayerViews.as_view()),
    path('player/avatar', views.avatar),
    path('game', views.GameViews.as_view()),
    path('game/list', views.games_list),
    path('game/history', views.game_history),
    path('game/join/<int:pk>', views.join_game),
    path('game/leave', views.leave_game),
    path('game/start', views.start_game),
    path('game/next', views.next_turn),
    path('answer', views.answer),
    path('answer/select/<int:pk>', views.select),
]

urlpatterns += [
    path('debug/ws_send/<nick>', views_debug.ws_send),
    path('debug/ws_broadcast/<int:pk>', views_debug.ws_broadcast),
]
