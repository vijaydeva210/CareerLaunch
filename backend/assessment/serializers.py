from rest_framework import serializers
from .models import Subject, Company, QuestionBank, Assessment, AssessmentResult, StudentAnswer

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'subject_type', 'weightage']


class QuestionBankSerializer(serializers.ModelSerializer):
    """
    CRITICAL SECURITY: 
    'correct_option' and 'explanation' are NOT in the fields list.
    """
    class Meta:
        model = QuestionBank
        fields = ['id', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'category']


class AssessmentListSerializer(serializers.ModelSerializer):
    subject_name = serializers.ReadOnlyField(source='subject.name')
    
    class Meta:
        model = Assessment
        fields = ['id', 'title', 'subject_name', 'total_marks', 'passing_marks']


class AssessmentDetailSerializer(serializers.ModelSerializer):
    subject_name = serializers.ReadOnlyField(source='subject.name')
    # This nests the secure questions inside the assessment JSON
    questions = QuestionBankSerializer(many=True, read_only=True)

    class Meta:
        model = Assessment
        fields = ['id', 'title', 'subject_name', 'total_marks', 'passing_marks', 'questions']