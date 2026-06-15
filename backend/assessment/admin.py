from django.contrib import admin
from .models import Subject, Company, QuestionBank, Assessment, AssessmentResult, StudentAnswer, LearningQuestion

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject_type', 'weightage')
    list_filter = ('subject_type',)
    search_fields = ('name',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(QuestionBank)
class QuestionBankAdmin(admin.ModelAdmin):
    list_display = ('get_short_question', 'category', 'subject', 'company', 'correct_option')
    list_filter = ('category', 'subject', 'company')
    search_fields = ('question_text',)

    def get_short_question(self, obj):
        if len(obj.question_text) > 60:
            return obj.question_text[:60] + '...'
        return obj.question_text
    get_short_question.short_description = 'Question'

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'subject', 'total_marks', 'passing_marks', 'is_active')
    list_filter = ('subject', 'is_active')
    search_fields = ('title',)
    filter_horizontal = ('questions',) 

class StudentAnswerInline(admin.TabularInline):
    model = StudentAnswer
    extra = 0
    readonly_fields = ('question', 'selected_option', 'is_correct')

@admin.register(AssessmentResult)
class AssessmentResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'assessment', 'score', 'passed', 'completed_at')
    list_filter = ('passed', 'assessment')
    search_fields = ('student__username', 'assessment__title')
    inlines = [StudentAnswerInline]

@admin.register(LearningQuestion)
class LearningQuestionAdmin(admin.ModelAdmin):
    list_display = ('get_short_question', 'category', 'subject', 'company')
    list_filter = ('category', 'subject', 'company')
    search_fields = ('question_text', 'answer_text')

    def get_short_question(self, obj):
        if len(obj.question_text) > 60:
            return obj.question_text[:60] + '...'
        return obj.question_text
    get_short_question.short_description = 'Study Question'