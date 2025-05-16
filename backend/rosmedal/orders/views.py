from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import OrderSerializer
from .services import count_order_price


class OrderCreateView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_data = request.data
        order_data['user'] = request.user.pk
        serializer = OrderSerializer(data=order_data)
        if serializer.is_valid():
            order_price = count_order_price(serializer.validated_data)
            print(order_price)
            # order = serializer.save()
            # return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)