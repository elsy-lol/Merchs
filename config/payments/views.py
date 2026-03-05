# apps/payments/views.py
from rest_framework import viewsets, permissions
from .models import PaymentTransaction
from .serializers import PaymentTransactionSerializer

class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(order__user=self.request.user)