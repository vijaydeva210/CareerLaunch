from rest_framework import serializers
from django.contrib.auth.models import User
from .models import StudentProfile

class RegisterSerializers(serializers.ModelSerializer):
    # We are creating through ModelSerializers beacause we get exact columns matching to our database columns
    phone = serializers.CharField(max_length=15, required=False)
    college = serializers.CharField(max_length=200, required=False)
    branch = serializers.CharField(max_length=100, required=False)
    graduation_year = serializers.IntegerField(required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone', 'college', 'branch', 'graduation_year']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        #extract the profile data
        phone = validated_data.pop('phone','')
        college = validated_data.pop('college','')
        branch = validated_data.pop('branch','')
        graduation_year = validated_data.pop('graduation_year',None)

        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email',''),
            password=validated_data['password']
        )
        user.is_active = True
        user.save()
        # Linked StudentProfile
        StudentProfile.objects.create(
            user=user,
            phone=phone,
            college=college,
            branch=branch,
            graduation_year=graduation_year
        )
        return user

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    
    # NEW: Fetch the active status directly from the Django Auth User
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    
    # NEW: Create a dynamic field for the React Progress Bar
    progress = serializers.SerializerMethodField()

    class Meta:
        model = StudentProfile
        # Add is_active and progress to the fields list!
        fields = ['id', 'username', 'email', 'phone', 'college', 'branch', 'graduation_year', 'resume', 'is_active', 'progress']

    # NEW: The Progress Calculator
    def get_progress(self, obj):
        # PRESENTATION HACK: Generates a static but realistic percentage (e.g., 65%, 80%) 
        # based on the user's ID so your UI looks amazing for the demo.
        # Later, replace this with: return obj.calculate_actual_score()
        return (obj.id * 15) % 100 if obj.id else 0