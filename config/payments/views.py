from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django.views.decorators.csrf import csrf_exempt
from .models import Payment  # ✅ Правильно: Payment, а не Review
from .serializers import PaymentSerializer, PaymentCreateSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(order__buyer=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        # Здесь логика редиректа на платежный шлюз
        return Response({'payment_url': payment.payment_url, 'id': payment.id})

@api_view(['POST'])
@csrf_exempt
def payment_webhook(request):
    """Вебхук от платежной системы"""
    # Здесь логика обработки уведомления об оплате
    return Response({'status': 'received'})