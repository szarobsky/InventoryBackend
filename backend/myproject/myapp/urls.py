from django.urls import path
from . import views

urlpatterns = [
    path('', views.my_view, name='index'),
    path('add_item/', views.add_item, name='add_item'),
]