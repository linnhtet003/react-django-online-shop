from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Products
from ..serializers import ProductsSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
import os

class ProductsList(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request):
        search_query = request.GET.get('search', '')
        category = request.GET.get('category', '')
        products = Products.objects.all().order_by("-updated_at")

        if search_query:
            products = products.filter(name__icontains=search_query)

        if category:
            products = products.filter(category__name__iexact=category)

        serializers = ProductsSerializer(products, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class ProductCreate(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def post(self, request):
        serializers = ProductsSerializer(data = request.data, context = {"request": request})
        if serializers.is_valid():
            serializers.save(created_by=request.user)
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetail(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request, pk):
        product = get_object_or_404(Products, pk=pk)
        serializers = ProductsSerializer(product)
        return Response(serializers.data)

class ProductUpdate(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def put(self, request, pk):
        product = get_object_or_404(Products, pk=pk)

        # for delete old image file
        new_image = request.FILES.get('p_image')
        if new_image and product.p_image and product.p_image.name != new_image.name:
            if os.path.isfile(product.p_image.path):
                os.remove(product.p_image.path)

        serializers = ProductsSerializer(product, data=request.data, partial=True, context={"request": request})
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDelete(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def delete(self, request, pk):
        product = get_object_or_404(Products, pk=pk)

        # for delete image file
        if product.p_image and os.path.isfile(product.p_image.path):
            os.remove(product.p_image.path)

        product.delete()
        return Response({"detail": f"{product.name} deleted successfully."})