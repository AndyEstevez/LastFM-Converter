from django.urls import path
from .views import GetLovedTracks, AuthURL, spotify_callback, IsAuthenticated, GetUserID, CreatePlaylist, SearchTrack, AddTracks

urlpatterns = [
    path('<str:username>/loved_tracks', GetLovedTracks.as_view()),
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('get-user-id', GetUserID.as_view()),
    path('create-playlist', CreatePlaylist.as_view()),
    path('<str:name>/search', SearchTrack.as_view()),
    path('add-tracks', AddTracks.as_view()),
]
