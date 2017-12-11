from django.urls import path

from api import views

urlpatterns = [
    path('player/', views.PlayerViews.as_view()),
    path('game/', views.GameViews.as_view()),
    path('game/join/<int:pk>', views.join_game),
    path('game/leave/', views.leave_game),
    path('game/start/', views.start_game),
    path('answer/', views.answer),
    path('answer/select/<int:pk>', views.select),
]
