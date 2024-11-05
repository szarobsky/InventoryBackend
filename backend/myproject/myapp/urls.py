from django.urls import path
from . import views

#URL configuration for myapp
urlpatterns = [
    path('item/', views.item, name='item'),
    path('user/', views.user, name='user'),
    path('api/csrf-token/', views.get_csrf_token, name='csrf-token'),
    path('recipe/', views.recipe, name='recipe')
]