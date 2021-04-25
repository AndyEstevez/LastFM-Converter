from django.urls import path
from .views import GetLovedTracks, AuthURL, spotify_callback, IsAuthenticated

urlpatterns = [
    path('<str:username>/loved_tracks', GetLovedTracks.as_view()),
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
]
