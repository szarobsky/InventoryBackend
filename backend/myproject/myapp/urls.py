from django.urls import path
from . import views

urlpatterns = [
    path('item/', views.item, name='item'),
    path('user/', views.user, name='user'),
]