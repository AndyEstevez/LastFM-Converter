from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from converter_playlist import settings
from requests import post, put, get

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

# save our token in brand new model or existing model
def update_or_create_user_tokens(session_id, refresh_token, access_token, expires_in, token_type):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)


    # if a token exists for our user, update the values for the user
    if tokens:
        tokens.refresh_token = refresh_token
        tokens.access_token = access_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['refresh_token', 'access_token', 'expires_in', 'token_type'])

    # create a token for the new user
    else:
        tokens = SpotifyToken(user=session_id, refresh_token=refresh_token, access_token=access_token,  
                                expires_in=expires_in,  token_type=token_type)
        tokens.save()


def is_spotify_authenticated(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    
    if not user_tokens.exists():
        return False
    # print(tokens.expires_in)
    if user_tokens.exists():
        expired = user_tokens[0].expires_in
        print("EXPIRES IN: ", expired)
        print("TIMEZONE NOW: ", timezone.now())
        if expired <= timezone.now():
            print("WAS TRUE")
            refresh_spotify_token(session_id)
        return True

# get access token, to use for getting the user_id in about the user endpoint & create a playlist endpoint
def get_access_token(session_id):
    tokens = get_user_tokens(session_id)

    if tokens:
        expired = tokens.expires_in

        if expired <= timezone.now():
            tokens = refresh_spotify_token(session_id)
        return tokens.access_token

    if tokens.access_token == None:
        refresh_spotify_token(session_id)
        tokens = get_user_tokens(session_id)

        if tokens:
            expired = tokens.expires_in

            if expired <= timezone.now():
                tokens = refresh_spotify_token(session_id)
            return tokens.access_token


def refresh_spotify_token(session_id):
    refresh_token = get_user_tokens(session_id).refresh_token
    tokens = get_user_tokens(session_id)
    user_tokens = SpotifyToken.objects.filter(user=session_id)

    print("REFRESH TOKENS: ", user_tokens[0].refresh_token)    
    print("REFRESH TOKENS: ", user_tokens[0].access_token)

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': (settings.CLIENT_ID),
        'client_secret': (settings.CLIENT_SECRET)
    }).json()

    refresh_token = response.get('refresh_token')
    access_token = response.get('access_token')
    expires_in = response.get('expires_in')
    token_type = response.get('token_type')


    update_or_create_user_tokens(session_id, refresh_token, access_token, expires_in, token_type)