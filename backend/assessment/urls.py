from django.urls import path
from .views import (SubmitAssessmentView,
                    AssessmentDetailView,
                    MyProgressView,
                    AssessmentListView, 
                    LearnedQuestionView, 
                    ImportAssessmentCSVView, 
                    LearningQuestionListView,
                    SubjectListView
)

urlpatterns = [
    #The learn phase
    path('learn-concepts/', LearningQuestionListView.as_view(), name='learn-concepts'),
    path('learned/', LearnedQuestionView.as_view(), name='learned-questions'),

    # The test phase
    path('list/', AssessmentListView.as_view(), name='assessment-list'),
    path('test/<int:pk>/', AssessmentDetailView.as_view(), name='assessment-detail'),
    path('submit/', SubmitAssessmentView.as_view(), name='submit-assessment'),
    
    # The ready phase
    path('my-progress/', MyProgressView.as_view(), name='my-progress'),
    path('import-csv/', ImportAssessmentCSVView.as_view(), name='import-csv'),
    path('subjects/', SubjectListView.as_view(), name='subject-list'),
]