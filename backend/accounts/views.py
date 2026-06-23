from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from .models import StudentProfile
from .serializers import RegisterSerializers, ProfileSerializer
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404 

# Get the custom User model
User = get_user_model()

class RegisterAPIView(APIView):
    def post(self, request):
        serializer = RegisterSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student registered successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated] 
    serializer_class = ProfileSerializer

    def get_object(self):
        profile, created = StudentProfile.objects.get_or_create(user=self.request.user)
        return profile

class AdminStudentListView(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = StudentProfile.objects.all()
    serializer_class = ProfileSerializer

class CreateAdminView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"error": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user already exists in the system
        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({"error": "A user with this username or email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # FIX 1: Use create_superuser() which guarantees staff/admin flags are securely set
            admin_user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            return Response({"message": f"Success: Admin account '{username}' has been created."}, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            # FIX 2: Attach the actual error string so the React frontend can tell you exactly what went wrong
            return Response({"error": f"Failed to create Admin account: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AdminStudentDetailView(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        # 1. Grab the Profile using the ID sent from React
        profile = get_object_or_404(StudentProfile, pk=pk)
        
        # 2. Extract the attached User
        user = profile.user
        
        # 3. Update the User's status
        new_status = request.data.get('is_active', user.is_active)
        user.is_active = new_status
        user.save()
        
        status_text = "activated" if new_status else "suspended"
        return Response({"message": f"Candidate '{user.username}' has been {status_text}."}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        # Apply the same fix for the delete method!
        profile = get_object_or_404(StudentProfile, pk=pk)
        user = profile.user
        username = user.username
        
        # Deleting the User will automatically delete the Profile because of models.CASCADE
        user.delete() 
        
        return Response({"message": f"Candidate '{username}' has been permanently deleted."}, status=status.HTTP_200_OK)

class ResumeUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        # Clean, single line. No try/except needed anymore!
        profile, created = StudentProfile.objects.get_or_create(user=request.user)

        file_obj = request.FILES.get('resume')
        
        if not file_obj:
            return Response({"error": "No file provided."}, status=status.HTTP_400_BAD_REQUEST)

        profile.resume = file_obj
        profile.save()
        
        return Response({"message": "Resume uploaded successfully!"}, status=status.HTTP_200_OK)

class ResumeDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Clean, single line.
        profile, created = StudentProfile.objects.get_or_create(user=request.user)

        if not profile.resume:
            return Response({"error": "No resume found on file."}, status=status.HTTP_404_NOT_FOUND)
        
        response = FileResponse(profile.resume.open('rb'), content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="my_resume.pdf"'
        return response

class ToggleStudentStatusView(APIView):
    def patch(self, request, pk):
        student_profile = get_object_or_404(StudentProfile, id=pk)
        user = student_profile.user
        user.is_active = not user.is_active
        user.save()
        status_text = "Activated" if user.is_active else "Suspended"
        return Response({"message": f"Student {status_text} successfully", "is_active": user.is_active}, status=status.HTTP_200_OK)