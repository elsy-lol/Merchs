# config/payments/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Payment
from .serializers import PaymentSerializer
from django.utils import timezone
import random


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet для управления платежами"""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        payment = self.get_object()
        
        if payment.status != 'pending':
            return Response(
                {'detail': 'Платёж уже обработан'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if random.random() > 0.1:
            payment.status = 'completed'
            payment.paid_at = timezone.now()
            payment.save()
            
            order = payment.order
            order.status = 'paid'
            order.save()
            
            return Response({
                'status': 'success',
                'message': 'Оплата успешна!',
                'payment_id': str(payment.id)
            })
        else:
            payment.status = 'failed'
            payment.save()
            
            return Response({
                'status': 'failed',
                'message': 'Оплата не прошла. Попробуйте снова.'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        payment = self.get_object()
        return Response({
            'id': str(payment.id),
            'status': payment.status,
            'amount': str(payment.amount),
            'paid_at': payment.paid_at
        })