from django.db import models
from django.conf import settings

# ==========================================
# 1. CORE CATEGORIES
# ==========================================
class Subject(models.Model):
    SUBJECT_TYPES = (
        ('technical', 'Technical'),
        ('aptitude', 'Aptitude'),
        ('hr', 'HR'),
    )
    name = models.CharField(max_length=100, unique=True)
    subject_type = models.CharField(max_length=20, choices=SUBJECT_TYPES, default='technical')
    weightage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) 

    def __str__(self):
        return f"{self.name} ({self.get_subject_type_display()})"


class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


# ==========================================
# 2. THE LEARN ARENA (Study Concepts)
# ==========================================
class LearningQuestion(models.Model):
    """
    STRICTLY for the study/learning section. No A/B/C/D options.
    """
    CATEGORY_CHOICES = (
        ('technical', 'Technical'),
        ('hr', 'HR'),
        ('company', 'Company-Specific'),
    )
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='learning_questions', null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='learning_questions')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='technical')
    
    question_text = models.TextField(help_text="e.g., What is the virtual DOM in React?")
    answer_text = models.TextField(help_text="Detailed explanation for the student.", blank=True, null=True)

    def __str__(self):
        return f"[LEARN] {self.question_text[:50]}..."


class LearnedQuestion(models.Model):
    """ Tracks which study concepts the student has marked as completed """
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='learned_questions')
    # FIX: Now points correctly to LearningQuestion!
    question = models.ForeignKey(LearningQuestion, on_delete=models.CASCADE, related_name='learned_by_students')
    completed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'question')

    def __str__(self):
        return f"{self.student.username} learned Q{self.question.id}"


# ==========================================
# 3. THE ASSESSMENT ARENA (Multiple Choice)
# ==========================================
class QuestionBank(models.Model):
    """
    The MCQ database for Tests and Assessments.
    """
    CATEGORY_CHOICES = (
        ('technical', 'Technical'),
        ('aptitude', 'Aptitude'),
        ('hr', 'HR'),
        ('company', 'Company-Specific'),
    )
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='questions', null=True, blank=True)
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='questions')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='technical')
    
    question_text = models.TextField()
    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)
    
    CORRECT_OPTIONS = (
        ('A', 'Option A'),
        ('B', 'Option B'),
        ('C', 'Option C'),
        ('D', 'Option D'),
    )
    correct_option = models.CharField(max_length=1, choices=CORRECT_OPTIONS)
    explanation = models.TextField(blank=True, null=True, help_text="Why is this answer correct?")

    def __str__(self):
        return f"[TEST] {self.question_text[:50]}..."


class Assessment(models.Model):
    title = models.CharField(max_length=200)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='assessments')
    questions = models.ManyToManyField(QuestionBank, related_name='assessments')
    total_marks = models.PositiveIntegerField(help_text="Total possible score", default=100)
    passing_marks = models.PositiveIntegerField(help_text="Minimum score to pass", default=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.subject.name})"


class AssessmentResult(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_results')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='results')
    score = models.PositiveIntegerField()
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} - {self.assessment.title}: {self.score}"


class StudentAnswer(models.Model):
    result = models.ForeignKey(AssessmentResult, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(QuestionBank, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=20, choices=QuestionBank.CORRECT_OPTIONS, null=True, blank=True)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer for Q{self.question.id} (Result: {self.result.id})"