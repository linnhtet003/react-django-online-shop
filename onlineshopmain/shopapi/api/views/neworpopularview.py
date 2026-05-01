from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import NeworPopular
from ..serializers import NeworPuSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404

class neworpupular(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def get(self, request):
        neworpo = NeworPopular.objects.all().order_by("-id")
        serializers = NeworPuSerializer(neworpo, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class neworpupularCreate(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def post(self, request):
        name = request.data.get('name')
        if NeworPopular.objects.filter(name = name).exists():
            return Response({"error": "name is already had been exist"})

        serializers = NeworPuSerializer(data = request.data, context = {"request": request})
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class neworpupularDetail(APIView):
    authentication_classes = (JWTAuthentication,)
    def get(self, request, pk):
        neworpupularid = get_object_or_404(NeworPopular, pk=pk)
        serializers = NeworPuSerializer(neworpupularid)
        return Response(serializers.data)

class neworpupularUpdate(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def put(self, request, pk):
        neworpo = get_object_or_404(NeworPopular, pk=pk)
        name = request.data.get('name')
        if NeworPopular.objects.filter(name = name).exclude(pk=pk).exists():
            return Response({"error": "name is already had been exist"})

        serializers = NeworPuSerializer(neworpo, data=request.data, context={"request": request})
        if serializers.is_valid():
            serializers.save()
            return Response(serializers.data, status=status.HTTP_200_OK)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class neworpupularDelete(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def delete(self, request, pk):
        neworpo = get_object_or_404(NeworPopular, pk=pk)
        neworpo.delete()
        return Response({"detail": f"{neworpo.name} deleted successfully."})