from django.db import models
from django.contrib.auth.models import User

class StudentProfile(models.Model):
    #Django built-in user table
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    #Student custom rows
    phone = models.CharField(max_length=15, blank=True, null=True)
    college = models.CharField(max_length=250, blank=True, null=True)
    branch = models.CharField(max_length=150, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    def __str__(self):
        return f"{self.user.username}'s Profile"
