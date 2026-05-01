from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Order, Products
from ..serializers import OrderSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.shortcuts import get_object_or_404

class OrderList(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def get(self, request):
        orders = Order.objects.all().order_by("-created_at")
        serializers = OrderSerializer(orders, many=True)
        return Response(serializers.data, status=status.HTTP_200_OK)

class OrderCreate(APIView):
    # authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializers = OrderSerializer(data=request.data)
        if serializers.is_valid():
            order = serializers.save(user=request.user)

            cart_items = request.data.get('cart_items', []) # If 'cart_items' exists, it will return its value (usually a list of items). If 'cart_items' does not exist, it will return the default value: an empty list [].
            for item in cart_items:
                product_id = item.get('id')
                quantity = item.get('quantity', 0) # If it's missing, it returns 0 as a fallback default.

                try:
                    product = get_object_or_404(Products, id = product_id)
                    if product.stock >= quantity:
                        product.stock -= quantity
                        product.save()
                    else:
                        return Response(
                            {"error": f"Not enough stock for product: {product.name}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except Products.DoesNotExist:
                    return Response(
                        {"error": f"Product ID {product_id} not found"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            return Response({"message": "Order placed successfully!"}, status=status.HTTP_201_CREATED)
        return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderDetail(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def get(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        serializers = OrderSerializer(order)
        return Response(serializers.data)

class OrderUpdate(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        order = get_object_or_404(Order, pk=pk)

        cart_items = request.data.get('cart_items', [])

        total_price = 0

        # validate + calculate
        for item in cart_items:
            price = float(item.get('price', 0))
            quantity = int(item.get('quantity', 0))

            # stock check
            product = get_object_or_404(Products, id=item.get('id'))
            if quantity > product.stock:
                return Response(
                    {"error": f"Stock exceeded for {product.name}"}, status=status.HTTP_400_BAD_REQUEST
                )

            total_price += price * quantity

        # save JSON directly
        order.cart_items = cart_items
        order.total_price = float(total_price)
        order.save()

        return Response({
            "message" : "Order updated successfully",
            "total_price": total_price
        }, status=status.HTTP_200_OK)

class OrderDelete(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = [IsAdminUser]
    def delete(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        order.delete()
        return Response({"detail": f"{order.name} deleted successfully."})