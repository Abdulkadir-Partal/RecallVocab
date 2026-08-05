from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (AddWordView, StreakView, TranslateWordView, WordInfoView,WordListView,RandomWordView,DeleteWordView,
                    ReviewWordView,WeakWordsView, ReviewSessionView, LevelWordsView, LevelWordsSubmitView, RegisterView, 
                    MeView, VerifyEmailView, health_check)

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/verify-email/<uuid:token>/", VerifyEmailView.as_view(), name="verify-email"),
    path("auth/login/", TokenObtainPairView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("auth/me/", MeView.as_view()),
    path("words/add/",AddWordView.as_view()),
    path("words/",WordListView.as_view()),
    path("words/random/",RandomWordView.as_view()),
    path("words/<int:pk>/",DeleteWordView.as_view()),
    path("review/",ReviewWordView.as_view()),
    path("review/weak/",WeakWordsView.as_view()),
    path("translate/",TranslateWordView.as_view()),
    path("review/session/",ReviewSessionView.as_view()),
    path("word-info/",WordInfoView.as_view()),
    path("streak/",StreakView.as_view()),
    path("words/<int:pk>/",DeleteWordView.as_view()),
    path("level-words/", LevelWordsView.as_view()),#buna tekrar bak 
    path("level-words/submit/", LevelWordsSubmitView.as_view()),#buna da
    path("health/", health_check),
]
