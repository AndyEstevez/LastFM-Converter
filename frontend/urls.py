from django.urls import path, include
from .views import index, error_404_view

urlpatterns = [
    path('', index, name=''),
    path('user/<str:username>', index),

]
