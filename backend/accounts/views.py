from rest_framework.generics import RetrieveUpdateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import StudentProfile
from .serializers import RegisterSerializers, ProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

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