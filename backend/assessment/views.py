import csv
import io
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser
from rest_framework import status
from django.shortcuts import get_object_or_404
from tablib import Dataset

from .serializers import AssessmentListSerializer, AssessmentDetailSerializer, SubjectSerializer
from .models import Subject, Assessment, AssessmentResult, StudentAnswer, LearnedQuestion, QuestionBank, LearningQuestion


# ---------------------------------------------------------
# 1. TEST FETCHER (GET)
# ---------------------------------------------------------
class AssessmentDetailView(RetrieveAPIView):
    queryset = Assessment.objects.filter(is_active=True)
    serializer_class = AssessmentDetailSerializer
    permission_classes = [IsAuthenticated]


# ---------------------------------------------------------
# 2. GRADING ENGINE (POST)
# ---------------------------------------------------------
class SubmitAssessmentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        student = request.user
        
        assessment_id = request.data.get('assessment_id')
        answers_data = request.data.get('answers', []) 

        if not assessment_id:
            return Response({"error": "assessment_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        assessment = get_object_or_404(Assessment, id=assessment_id, is_active=True)
        questions = assessment.questions.all()
        total_questions = questions.count()

        if total_questions == 0:
            return Response({"error": "This test has no questions."}, status=status.HTTP_400_BAD_REQUEST)

        marks_per_question = assessment.total_marks / total_questions
        earned_score = 0
        correct_count = 0

        result = AssessmentResult.objects.create(
            student=student,
            assessment=assessment,
            score=0, 
            passed=False
        )

        frontend_answers = {item.get('question_id'): item.get('selected_option') for item in answers_data}
        student_answers_to_create = []

        for question in questions:
            selected_option = frontend_answers.get(question.id)
            is_correct = False

            if selected_option and selected_option == question.correct_option:
                is_correct = True
                correct_count += 1
                earned_score += marks_per_question

            student_answers_to_create.append(
                StudentAnswer(
                    result=result,
                    question=question,
                    selected_option=selected_option,
                    is_correct=is_correct
                )
            )

        StudentAnswer.objects.bulk_create(student_answers_to_create)

        final_score = round(earned_score)
        passed = final_score >= assessment.passing_marks
        
        result.score = final_score
        result.passed = passed
        result.save()

        review_data = []
        for answer in student_answers_to_create:
            review_data.append({
                "question_text": answer.question.question_text,
                "selected_option": answer.selected_option,
                "correct_option": answer.question.correct_option,
                "is_correct": answer.is_correct,
                # Optional: Send the exact text of the options so React can display them easily
                "option_a": answer.question.option_a,
                "option_b": answer.question.option_b,
                "option_c": answer.question.option_c,
                "option_d": answer.question.option_d,
            })

        return Response({
            "message": "Test successfully graded.",
            "assessment_title": assessment.title,
            "total_questions": total_questions,
            "correct_answers": correct_count,
            "score": final_score,
            "passed": passed,
            "review": review_data
        }, status=status.HTTP_200_OK)


# ---------------------------------------------------------
# 3. PROGRESS ENGINE (GET)
# ---------------------------------------------------------
class MyProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        technical_subjects = Subject.objects.filter(subject_type='technical')
        
        total_progress = 0.0
        subject_breakdown = []

        for subject in technical_subjects:
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
    queryset = Assessment.objects.filter(is_active=True)
    serializer_class = AssessmentListSerializer
    permission_classes = [IsAuthenticated]

# ---------------------------------------------------------
# 4. LEARN ARENA DATA FETCHER (GET)
# Sends the imported study concepts to the React frontend
# ---------------------------------------------------------
class LearningQuestionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fetch all study concepts from the database
        questions = LearningQuestion.objects.select_related('subject').all()
        
        # Package them into a clean list for React
        data = []
        for q in questions:
            data.append({
                "id": q.id,
                "subject": q.subject.name if q.subject else "General",
                "text": q.question_text
            })
            
        return Response(data, status=status.HTTP_200_OK)

# ---------------------------------------------------------
# 5. LEARN ARENA TRACKER
# ---------------------------------------------------------
class LearnedQuestionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        learned_ids = LearnedQuestion.objects.filter(student=request.user).values_list('question_id', flat=True)
        return Response({"learned_question_ids": list(learned_ids)}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        question_id = request.data.get('question_id')
        
        if not question_id:
            return Response({"error": "question_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        # --- FIX 2: Checkboxes now correctly point to LearningQuestion ---
        question = get_object_or_404(LearningQuestion, id=question_id)
        
        learned_record, created = LearnedQuestion.objects.get_or_create(student=request.user, question=question)

        if created:
            return Response({"message": "Question marked as completed.", "status": "learned"}, status=status.HTTP_201_CREATED)
        else:
            learned_record.delete()
            return Response({"message": "Question unmarked.", "status": "unlearned"}, status=status.HTTP_200_OK)


# ---------------------------------------------------------
# 6. CARGO ENGINE (POST)
# ---------------------------------------------------------
class ImportAssessmentCSVView(APIView):
    permission_classes = [IsAdminUser] 
    parser_classes = [MultiPartParser] 

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        subject_name = request.data.get('subject') 
        upload_type = request.data.get('type')     
        
        if not file_obj or not subject_name or not upload_type:
            return Response({"error": "Missing file, subject, or upload type."}, status=status.HTTP_400_BAD_REQUEST)
            
        if not file_obj.name.endswith('.csv'):
            return Response({"error": "File must be a CSV format."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subject, _ = Subject.objects.get_or_create(name=subject_name)

            decoded_file = file_obj.read().decode('utf-8-sig')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)

            success_count = 0

            if upload_type == 'learn':
                # --- FIX 3: Push Study Concepts to the correct table & field ---
                for row in reader:
                    LearningQuestion.objects.create(
                        subject=subject,
                        question_text=row.get('concept_text', '') 
                    )
                    success_count += 1
                    
            elif upload_type == 'test':
                # --- FIX 4: Correct ManyToMany relation mapping ---
                assessment, _ = Assessment.objects.get_or_create(
                    subject=subject,
                    defaults={'title': f"{subject.name} Assessment", 'total_marks': 100, 'passing_marks': 50}
                )
                
                for row in reader:
                    # Create the multiple choice question
                    q = QuestionBank.objects.create(
                        subject=subject,
                        question_text=row.get('question_text', ''),
                        option_a=row.get('option_a', ''),
                        option_b=row.get('option_b', ''),
                        option_c=row.get('option_c', ''),
                        option_d=row.get('option_d', ''),
                        correct_option=row.get('correct_answer', '').upper() 
                    )
                    # Attach the question to the Assessment container
                    assessment.questions.add(q)
                    success_count += 1
            else:
                return Response({"error": "Invalid upload type."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": f"Successfully imported {success_count} rows into {subject_name}."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            import traceback
            print("================ CRITICAL CSV ERROR ================")
            traceback.print_exc() 
            print("====================================================")
            
            return Response({
                "error": f"Database rejected the data: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)

class SubjectListView(ListAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]