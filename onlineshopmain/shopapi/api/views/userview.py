from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import CustomUser
from ..serializers import UserSerializer, UserCreateSerailizer, UserDetailSerializer
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
import os
from django.conf import settings

# from django.contrib.auth import authenticate
# from rest_framework.authtoken.models import Token
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAdminUser

# Create your views here.

class UserList(APIView):
    authentication_classes = (JWTAuthentication,) # [JWTAuthentication]
    permission_classes = [IsAdminUser]
    def get(self,request):
        users = CustomUser.objects.all()
        data = []
        for user in users:
            serializer = UserSerializer(user, context={"request": request})
            data.append(serializer.data)
        return Response(data, status=status.HTTP_200_OK)

class RegisterUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name')
        password = request.data.get('password')

        if CustomUser.objects.filter(email = email).exists():
            return Response({'error': 'Your email is already taken'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.create_user(
                email = email,
                name = name,
                password = password
            )

            refresh = RefreshToken.for_user(user)
            serializer = UserCreateSerailizer(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserDetail(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self,request):
        user = get_object_or_404(CustomUser, id=request.user.id)
        serializers = UserDetailSerializer(user)
        return Response(serializers.data, status=status.HTTP_200_OK)

class UserUpdate(APIView):
    authentication_classes = (JWTAuthentication,)
    def put(self, request):
        user = get_object_or_404(CustomUser, id=request.user.id)

        new_profile = request.FILES.get('user_profile')
        if new_profile and user.user_profile.name != settings.DEFAULT_PROFILE_IMAGE and user.user_profile.name != new_profile.name:
            if os.path.isfile(user.user_profile.path):
                os.remove(user.user_profile.path)
        serializers = UserSerializer(user, data=request.data, context={"request": request}, partial=True)   # partial=True is  to remain other data, access only user_profile
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

# class RegisterUser(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = UserCreateSerailizer(data=request.data)
#         if serializer.is_valid():
#             user = serializer.save()
#             token, _= Token.objects.get_or_create(user=user)    #  _: a boolean (True if it was created, False if already existed — we ignore it using _).
#             return Response({'token': token.key}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# try:
#     if os.path.isfile(user.user_profile.path):
#         os.remove(user.user_profile.path)
# except Exception as e:
#     print("Failed to delete old image:", e)

# from rest_framework.permissions import IsAuthenticated

# class PasswordChangeView(APIView):
#     authentication_classes = (JWTAuthentication,)
#     permission_classes = [IsAuthenticated]

#     def put(self, request):
#         user = request.user
#         old_password = request.data.get("old_password")
#         new_password = request.data.get("new_password")

#         if not old_password or not new_password:
#             return Response({"detail": "Old and new passwords are required."}, status=400)

#         if not user.check_password(old_password):
#             return Response({"detail": "Old password is incorrect."}, status=400)

#         user.set_password(new_password)
#         user.save()
#         return Response({"detail": "Password updated successfully."}, status=200)
