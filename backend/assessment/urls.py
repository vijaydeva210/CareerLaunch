from django.urls import path
from .views import SubmitAssessmentView, AssessmentDetailView, MyProgressView, AssessmentListView, LearnedQuestionView

urlpatterns = [
    #The learn phase
    path('learned/', LearnedQuestionView.as_view(), name='learned-questions'),

    # The test phase
    path('list/', AssessmentListView.as_view(), name='assessment-list'),
    path('test/<int:pk>/', AssessmentDetailView.as_view(), name='assessment-detail'),
    path('submit/', SubmitAssessmentView.as_view(), name='submit-assessment'),
    
    # The ready phase
    path('my-progress/', MyProgressView.as_view(), name='my-progress'),
]