from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Categories
from ..serializers import CategorySerailizer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404

class Category(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request):
        categories = Categories.objects.all().order_by("-id")
        serializers = CategorySerailizer(categories, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class CategoryCreate(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def post(self, request):
        name = request.data.get('name')
        if Categories.objects.filter(name = name).exists():
            return Response({'error': 'Category already had been exist'}, status=status.HTTP_400_BAD_REQUEST)

        serializers = CategorySerailizer(data = request.data, context={'request': request})
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetail(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request, pk):
        category = get_object_or_404(Categories, pk=pk)
        serializers = CategorySerailizer(category)
        return Response(serializers.data)

class CategoryUpdate(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def put(self, request, pk):
        category = get_object_or_404(Categories, pk=pk)
        name = request.data.get('name')
        if Categories.objects.filter(name = name).exists():
            return Response({'error': 'Category already had been exist'}, status=status.HTTP_400_BAD_REQUEST)
        serializers = CategorySerailizer(category, data=request.data, context={'request': request})
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_200_OK)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDelete(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def delete(self, request, pk):
        category = get_object_or_404(Categories, pk=pk)
        category.delete()
        return Response({"detail": f"{category.name} deleted successfully."}, status=status.HTTP_200_OK)