from rest_framework import generics
from rest_framework.permissions import IsAuthenticated 

from orders.models import PromotionalCode
from orders.serializers import PromotionalCodeSerializer


class PromotionalCodeDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PromotionalCodeSerializer
    queryset = PromotionalCode.objects.all()
    lookup_field = "code"
