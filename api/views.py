from django.shortcuts import render, redirect
from converter_playlist import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from requests import Request, post
from .util import update_or_create_user_tokens, is_spotify_authenticated


# Create your views here.

# get loved tracks of a user from Last.fm
class GetLovedTracks(APIView):
    def get(self, request, username):
        url = 'http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&api_key=' + str(settings.LASTFM_APIKEY) + '&format=json&limit=1000&user=' + str(username)
        
        response = requests.get(url).json()

        return Response(response, status=status.HTTP_200_OK)

# send request to Spotify
class AuthURL(APIView):
    def get(self, request, format=None):
        # need scopes for what we want to modify for the user
        scopes = 'playlist-modify-public playlist-modify-private'
        
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': str(settings.REDIRECT_URI),
            'client_id': str(settings.CLIENT_ID),
        }).prepare().url

        print(url)
        return Response({'url': url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    if error == 'access_denied':
        return redirect('frontend:')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': str(settings.REDIRECT_URI),
        'client_id': str(settings.CLIENT_ID),
        'client_secret': str(settings.CLIENT_SECRET)
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)

    return redirect('frontend:')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        print(is_authenticated)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)