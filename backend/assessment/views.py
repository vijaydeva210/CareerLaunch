from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView
from .serializers import AssessmentListSerializer

from .models import Subject, Assessment, AssessmentResult, StudentAnswer, LearnedQuestion, QuestionBank
from .serializers import AssessmentDetailSerializer


# ---------------------------------------------------------
# 1. TEST FETCHER (GET)
# Sends the test and secure questions to the React frontend
# ---------------------------------------------------------
class AssessmentDetailView(RetrieveAPIView):
    queryset = Assessment.objects.filter(is_active=True)
    serializer_class = AssessmentDetailSerializer
    permission_classes = [IsAuthenticated]


# ---------------------------------------------------------
# 2. GRADING ENGINE (POST)
# Receives student answers, grades them, and saves the result
# ---------------------------------------------------------
class SubmitAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        student = request.user
        
        # 1. Extract data from the frontend JSON payload
        assessment_id = request.data.get('assessment_id')
        answers_data = request.data.get('answers', []) # Expected format: [{"question_id": 1, "selected_option": "A"}, ...]

        if not assessment_id:
            return Response({"error": "assessment_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Fetch the test and its questions safely
        assessment = get_object_or_404(Assessment, id=assessment_id, is_active=True)
        questions = assessment.questions.all()
        total_questions = questions.count()

        if total_questions == 0:
            return Response({"error": "This test has no questions."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Calculate math: How many marks is one question worth?
        marks_per_question = assessment.total_marks / total_questions
        earned_score = 0
        correct_count = 0

        # 4. Create the initial Result record
        result = AssessmentResult.objects.create(
            student=student,
            assessment=assessment,
            score=0, # Placeholder, will update below
            passed=False
        )

        # Convert React's answer list into a dictionary for fast lookup: {question_id: "A"}
        frontend_answers = {item.get('question_id'): item.get('selected_option') for item in answers_data}
        student_answers_to_create = []

        # 5. The Grading Loop
        for question in questions:
            selected_option = frontend_answers.get(question.id)
            is_correct = False

            # Check if they answered it AND if it is correct
            if selected_option and selected_option == question.correct_option:
                is_correct = True
                correct_count += 1
                earned_score += marks_per_question

            # Prepare the granular answer record for the database
            student_answers_to_create.append(
                StudentAnswer(
                    result=result,
                    question=question,
                    selected_option=selected_option,
                    is_correct=is_correct
                )
            )

        # Bulk create all the answer records at once (highly optimized for the database)
        StudentAnswer.objects.bulk_create(student_answers_to_create)

        # 6. Finalize the score and save
        final_score = round(earned_score)
        passed = final_score >= assessment.passing_marks
        
        result.score = final_score
        result.passed = passed
        result.save()

        # 7. Return the final result to React
        return Response({
            "message": "Test successfully graded.",
            "assessment_title": assessment.title,
            "total_questions": total_questions,
            "correct_answers": correct_count,
            "score": final_score,
            "passed": passed
        }, status=status.HTTP_200_OK)


# ---------------------------------------------------------
# 3. PROGRESS ENGINE (GET)
# Calculates overall technical readiness for the dashboard
# ---------------------------------------------------------
class MyProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Fetch strictly 'technical' subjects (ignores Aptitude/HR)
        technical_subjects = Subject.objects.filter(subject_type='technical')
        
        total_progress = 0.0
        subject_breakdown = []

        for subject in technical_subjects:
            # Find the student's highest score for this subject
            best_result = AssessmentResult.objects.filter(
                student=user,
                assessment__subject=subject
            ).order_by('-score').first()

            subject_progress = 0.0
            
            if best_result and best_result.assessment.total_marks > 0:
                score_percentage = best_result.score / best_result.assessment.total_marks
                subject_progress = score_percentage * float(subject.weightage)
            
            total_progress += subject_progress
            
            subject_breakdown.append({
                "subject": subject.name,
                "weightage": float(subject.weightage),
                "progress_earned": round(subject_progress, 2)
            })

        return Response({
            "student_id": user.id,
            "total_technical_progress_percentage": round(total_progress, 2),
            "breakdown": subject_breakdown
        })
    


class AssessmentListView(ListAPIView):
    """
    Returns a lightweight list of all active assessments for the dashboard.
    Does NOT include the questions.
    """
    queryset = Assessment.objects.filter(is_active=True)
    serializer_class = AssessmentListSerializer
    permission_classes = [IsAuthenticated]

class LearnedQuestionView(APIView):
    """
    Handles the 'LEARN' phase of the Master Blueprint.
    GET: Returns a simple array of question IDs the student has marked as completed.
    POST: Marks a question as learned (or unmarks it if already learned).
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Returns [1, 4, 5, 9] so React knows which checkboxes to show as "checked"
        learned_ids = LearnedQuestion.objects.filter(student=request.user).values_list('question_id', flat=True)
        return Response({"learned_question_ids": list(learned_ids)}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        question_id = request.data.get('question_id')
        
        if not question_id:
            return Response({"error": "question_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        question = get_object_or_404(QuestionBank, id=question_id)
        
        # get_or_create checks if it exists. If it does, it fetches it. If not, it creates it.
        learned_record, created = LearnedQuestion.objects.get_or_create(student=request.user, question=question)

        if created:
            return Response({"message": "Question marked as completed.", "status": "learned"}, status=status.HTTP_201_CREATED)
        else:
            # If they click the checkbox again, we un-mark it (delete the record)
            learned_record.delete()
            return Response({"message": "Question unmarked.", "status": "unlearned"}, status=status.HTTP_200_OK)