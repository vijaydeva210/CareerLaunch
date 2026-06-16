from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin
from .models import StudentProfile

# 1. Tell Django how we want the profile data to look
class StudentProfileInline(admin.StackedInline):
    model = StudentProfile
    can_delete = False
    verbose_name_plural = 'College Details'

# 2. Attach our new profile design to the default User view
class UserAdmin(AuthUserAdmin):
    inlines = [StudentProfileInline]

# 3. THESE MUST BE ALL THE WAY TO THE LEFT (Zero spaces before 'admin')
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(StudentProfile)