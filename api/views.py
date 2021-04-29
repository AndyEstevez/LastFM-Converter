from django.shortcuts import render, redirect
from converter_playlist import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import requests
from requests import Request, post, get
from .util import update_or_create_user_tokens, is_spotify_authenticated, get_access_token, refresh_spotify_token
import json


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
        'redirect_uri': (settings.REDIRECT_URI),
        'client_id': (settings.CLIENT_ID),
        'client_secret': (settings.CLIENT_SECRET)
    }).json()

    print("IN SPOTIFY CALLBACK: ", response)
    print("USER ID: ", response.get('user_id'))

    refresh_token = response.get('refresh_token')
    access_token = response.get('access_token')
    expires_in = response.get('expires_in')
    token_type = response.get('token_type')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, refresh_token, access_token, expires_in, token_type)

    return redirect('frontend:')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        print("IS AUTHENTICATED:", is_authenticated)

        if is_authenticated == None:
            print("IT WAS NONE")
            is_authenticated = False
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

# class GetAccessToken(APIView):
#     def get(self, request, format=None):
#         access_token = get_access_token(self.request.session.session_key)
#         return Response({'access_token': access_token}, status=status.HTTP_200_OK)

class GetUserID(APIView):
    def get(self, request, format=None):
        base_url = "https://api.spotify.com/v1/me"

        access_token = get_access_token(self.request.session.session_key)
        print("ACCESS TOKEN: ", access_token)
        if access_token == None:
            refresh_spotify_token(self.request.session.session_key)
            access_token = get_access_token(self.request.session.session_key)

        headers = {'Authorization': 'Bearer {token}'.format(token=access_token)}

        response = requests.get(base_url, headers=headers)
        response = response.json()

        return Response(response['id'], status=status.HTTP_200_OK)

class CreatePlaylist(APIView):
    def post(self, request, format=None):
        access_token = get_access_token(self.request.session.session_key)

        base_url = "https://api.spotify.com/v1/users/" + request.data.get('user_id') + "/playlists"


        headers = {'Authorization': 'Bearer {token}'.format(token=access_token)}
        data = json.dumps({
            'name': request.data.get('name'),
            'public': request.data.get('public')
        })

        response = requests.post(url=base_url, data=data, headers={"Content-Type": "application/json", "Authorization": "Bearer " + access_token})
        response = response.json()
        print(response)

        return Response(response, status=status.HTTP_200_OK)

class SearchTrack(APIView):
    def get(self, request, name, artistName):
        access_token = get_access_token(self.request.session.session_key)
        
        # print("ARTIST OF TRACK: ", artistName)

        offset_val = 0
        foundTrack = False

        if '/' in artistName:
            artistName = artistName.replace('/', '')

        base_url = "https://api.spotify.com/v1/search?q=" + name + "&type=track&limit=50&offset=" + str(offset_val)
        headers = {'Authorization': 'Bearer {token}'.format(token=access_token)}

        while foundTrack == False or offset_val < 1000:
        
            response = requests.get(base_url, headers=headers)
            response = response.json()
            
            if "error" in response:
                return Response('', status=status.HTTP_200_OK)

            if not response['tracks']['items']:
                return Response('', status=status.HTTP_200_OK)

            for x in response['tracks']['items']:
                if x is None:
                    return Response('', status=status.HTTP_200_OK)


                if artistName.lower() == x['artists'][0]['name'].lower() and name.lower() == x['name'].lower():
                    foundTrack = True
                    uri = x['uri']
                    print(x['uri'])
                    return Response(uri, status=status.HTTP_200_OK)
                
            base_url = base_url.replace("&offset="+str(offset_val), "&offset="+str(offset_val+50))
            offset_val = offset_val + 50
        
        return Response('', status=status.HTTP_200_OK)


class AddTracks(APIView):
    def post(self, request, format=None):
        access_token = get_access_token(self.request.session.session_key)

        base_url = "https://api.spotify.com/v1/playlists/" + request.data.get('playlist_id') + "/tracks?uris="
        headers = {'Authorization': 'Bearer {token}'.format(token=access_token)}
        
        base_url = base_url + request.data.get('uris')
        response = requests.post(url=base_url, headers={"Content-Type": "application/json", "Authorization": "Bearer " + access_token})
        response = response.json()

        print("RESPONSE: ", response)
        return Response(response, status=status.HTTP_200_OK)