from django.db import models
from django.conf import settings

# Create your models here.
class Subject(models.Model):
    SUBJECT_TYPES = (
        ('technical', 'Technical'),
        ('aptitude', 'Aptitude'),
        ('hr', 'HR'),
    )
    name = models.CharField(max_length=100, unique=True)
    subject_type = models.CharField(max_length=20, choices=SUBJECT_TYPES, default='technical')
    #This is Percentage Weight like % 
    weightage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    def __str__(self):
        return f"{self.name} ({self.get_subject_type_display()})"


class Company(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name
    
class StudyQuestion(models.Model):
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='study_questions')
    #null=True,blank=True because a generic HTML questions dynamically changes
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, blank=True, related_name='company_questions')

    question_text = models.TextField()
    answer_text = models.TextField()

    def __str__(self):
        return f"[{self.subject.name}] {self.question_text[:50]}..."


class Assessment(models.Model):
    title = models.CharField(max_length=200)
    #linking the test to the subjects we already created
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='assessment')
    total_marks = models.PositiveIntegerField(help_text="Total possible score")
    passing_marks = models.PositiveIntegerField(help_text="Minimum score to pass")
    is_active = models.BooleanField(default=True, help_text="Set false to hide students")
    def __str__(self):
        return f"{self.title} ({self.subject.name})"


class MCQQuestion(models.Model):
    # A question belongs to an assessment
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='mcq_questions')

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

    # In case some questions carry more weight than others
    marks = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.question_text[:50]}..."
    
class AssessmentResult(models.Model):
    # This safely links to the User models built by your teammates
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assessment_results')
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='results')


    score = models.PositiveIntegerField()
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User ID {self.student_id} - {self.assessment.title}: {self.score}"
    