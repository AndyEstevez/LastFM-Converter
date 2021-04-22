from django.urls import path
from .views import GetLovedTracks

urlpatterns = [
    path('<str:username>/loved_tracks', GetLovedTracks.as_view()),
]
