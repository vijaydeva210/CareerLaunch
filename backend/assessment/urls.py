from django.urls import path
from .views import SubmitAssessmentView, AssessmentDetailView, MyProgressView, AssessmentListView

urlpatterns = [
    # 1. The NEW endpoint fot the DashBoard: /api/assessments/list/
    path('list/', AssessmentListView.as_view(), name='assessment-list'),

    # 2. The Test Fetcher (GET) - E.g., /api/assessments/test/1/
    path('test/<int:pk>/', AssessmentDetailView.as_view(), name='assessment-detail'),
    
    # 3. The Grading Engine (POST) - E.g., /api/assessments/submit/
    path('submit/', SubmitAssessmentView.as_view(), name='submit-assessment'),
    
    # 4. The Progress Engine (GET) - E.g., /api/assessments/my-progress/
    path('my-progress/', MyProgressView.as_view(), name='my-progress'),
]