from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Subject, Company, QuestionBank, Assessment, AssessmentResult, StudentAnswer, LearningQuestion, StudyTopic, TestQuestion

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'subject_type', 'weightage')
    list_filter = ('subject_type',)
    search_fields = ('name',)

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# UPGRADED FOR EXCEL IMPORTS
@admin.register(QuestionBank)
class QuestionBankAdmin(ImportExportModelAdmin):
    list_display = ('get_short_question', 'category', 'subject', 'company', 'correct_option')
    list_filter = ('category', 'subject', 'company')
    search_fields = ('question_text',)

    def get_short_question(self, obj):
        if len(obj.question_text) > 60:
            return obj.question_text[:60] + '...'
        return obj.question_text
    get_short_question.short_description = 'Question'

# UPGRADED FOR EXCEL IMPORTS
@admin.register(Assessment)
class AssessmentAdmin(ImportExportModelAdmin):
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

# UPGRADED FOR EXCEL IMPORTS
@admin.register(LearningQuestion)
class LearningQuestionAdmin(ImportExportModelAdmin):
    list_display = ('get_short_question', 'category', 'subject', 'company')
    list_filter = ('category', 'subject', 'company')
    search_fields = ('question_text', 'answer_text')

    def get_short_question(self, obj):
        if len(obj.question_text) > 60:
            return obj.question_text[:60] + '...'
        return obj.question_text
    get_short_question.short_description = 'Study Question'

# The new ones we just made (Kept here so your code doesn't crash)
@admin.register(StudyTopic)
class StudyTopicAdmin(ImportExportModelAdmin):
    list_display = ('id', 'subject', 'topic_text')

@admin.register(TestQuestion)
class TestQuestionAdmin(ImportExportModelAdmin):
    list_display = ('id', 'subject', 'question_text', 'correct_option')