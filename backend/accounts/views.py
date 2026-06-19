from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import StudentProfile
from .serializers import RegisterSerializers, ProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model 

# Get the custom User model
User = get_user_model()

class RegisterAPIView(APIView):
    def post(self,request):
        serializer = RegisterSerializers(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student registered successfully!"},status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

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


class PromoteUserView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            # Give them the keys to the vault
            user.is_staff = True
            user.is_superuser = True 
            user.save()
            
            return Response({"message": f"Success: {user.email} is now an Admin."}, status=status.HTTP_200_OK)
            
        except User.DoesNotExist:
            return Response({"error": "User not found in the database."}, status=status.HTTP_404_NOT_FOUND)