from django.db import models

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


