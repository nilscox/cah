from django.urls import path

from api import views

urlpatterns = [
    path('player/', views.PlayerViews.as_view()),
    path('game/', views.create_game),
    path('game/join/', views.join_game),
    path('game/leave/', views.leave_game),
    path('game/start/', views.start_game),
    path('answer/', views.answer),
    path('answer/select/', views.select),
]
