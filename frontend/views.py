from django.shortcuts import render

# Create your views here.
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')

def error_404_view(request, exception):
    return render(request, 'frontend/404.html')