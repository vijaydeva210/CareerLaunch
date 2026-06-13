from django.contrib import admin
# Update and add new Models
from .models import Subject, Company, StudyQuestion, Assessment, MCQQuestion, AssessmentResult 

# Register your models here.

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    # Display these columns in the list view
    list_display = ('name', 'subject_type', 'weightage')
    # Adds a sidebar filter for Technical vs Aptitude vs HR
    list_filter = ('subject_type',)
    # Adds a search bar for the subject name
    search_fields = ('name',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(StudyQuestion)
class StudyQuestionAdmin(admin.ModelAdmin):
    list_display = ('get_short_question', 'subject', 'company')
    list_filter = ('subject', 'company')
    search_fields = ('question_text', 'answer_text')

    # This custom method truncate long questions so they don't break UI layout
    def get_short_question(self, obj):
        if len(obj.question_text) > 60:
            return obj.question_text[:60] + '...'
        return obj.question_text
    get_short_question.short_description = 'Question'

class MCQQuestionInline(admin.TabularInline):
    model = MCQQuestion
    extra = 1
@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'total_marks', 'passing_marks', 'is_active')
    list_filter = ('subject', 'is_active')
    search_fields = ('title',)
    inlines = [MCQQuestionInline]

@admin.register(MCQQuestion)
class MCQQuestionAdmin(admin.ModelAdmin):
    list_display = ('get_short_question', 'assessment', 'correct_option', 'marks')
    list_filter = ('assessment',)
    search_fields = ('question_text',)

    def get_short_question(self, obj):
        if len(obj.question_text) > 60:
            return obj.question_text[:60] + '...'
        return obj.question_text
    get_short_question.short_description = 'Question'

@admin.register(AssessmentResult)
class AssessmentResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'assessment', 'score', 'passed','completed_at')
    list_filter = ('passed', 'assessment')
    search_fields = ('student__username', 'student__email', 'assessment__title')
