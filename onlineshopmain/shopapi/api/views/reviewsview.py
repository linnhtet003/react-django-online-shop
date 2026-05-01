from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Review
from ..serializers import ReviewsSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404

class ReviewList(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request):
        reviews = Review.objects.all().order_by("-created_at")
        serializers = ReviewsSerializer(reviews, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class ReviewCreate(APIView):
    authentication_classes = (JWTAuthentication,)
    def post(self, request):
        serializers = ReviewsSerializer(data =request.data, context = {"request" : request})
        if serializers.is_valid():
            serializers.save(created_by=request.user)
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDelete(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk)

        user_name = review.created_by.name

        review.delete()

        return Response({"detail": f"{user_name} deleted successfully."})