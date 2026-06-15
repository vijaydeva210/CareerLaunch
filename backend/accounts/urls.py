from django.urls import path
from .views import RegisterAPIView, UserProfileView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/',RegisterAPIView.as_view(), name='register'),
    path('login/',TokenObtainPairView.as_view(), name='login'),
    path('profile/',UserProfileView.as_view(), name='Profile')
]