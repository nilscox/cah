from django.urls import path

from api import views
from api import views_debug

urlpatterns = [
    path('player', views.PlayerViews.as_view()),
    path('game', views.GameViews.as_view()),
    path('game/join/<int:pk>', views.join_game),
    path('game/leave', views.leave_game),
    path('game/start', views.start_game),
    path('answer', views.answer),
    path('answer/select/<int:pk>', views.select),
]

urlpatterns += [
    path('debug/ws_send/<nick>', views_debug.ws_send),
    path('debug/ws_broadcast/<int:pk>', views_debug.ws_broadcast),
]
