from django.urls import path
from .views import (
    RegisterAPIView, 
    UserProfileView, 
    AdminStudentListView, 
    CreateAdminView, 
    AdminStudentDetailView, 
    ResumeUploadView, 
    ResumeDownloadView,
    ToggleStudentStatusView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('resume/upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('resume/download/', ResumeDownloadView.as_view(), name='resume-download'),
    path('create-admin/', CreateAdminView.as_view(), name='create-admin'),
    path('students/', AdminStudentListView.as_view(), name='admin-student-list'),
    path('students/<int:pk>/', AdminStudentDetailView.as_view(), name='student-detail'),
    path('admin/students/<int:pk>/toggle/', ToggleStudentStatusView.as_view(), name='student-toggle'),
]