from django.shortcuts import render
from converter_playlist import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import requests


# Create your views here.
class GetLovedTracks(APIView):
    def get(self, request, username):
        url = 'http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&api_key=' + str(settings.LASTFM_APIKEY) + '&format=json&limit=1000&user=' + str(username)
        
        response = requests.get(url).json()

        return Response(response, status=status.HTTP_200_OK)