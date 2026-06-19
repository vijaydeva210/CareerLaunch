from django.urls import path
from .views import RegisterAPIView, UserProfileView, AdminStudentListView, PromoteUserView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='Profile'),
    path('students/', AdminStudentListView.as_view(), name='admin-student-list'),
    path('promote/', PromoteUserView.as_view(), name='promote-admin'),
]