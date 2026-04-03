# config/payments/serializers.py

from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    """Сериализатор платежей"""
    order_id = serializers.IntegerField(write_only=True, required=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'order',
            'order_id',
            'user',
            'amount',
            'payment_method',
            'status',
            'qr_code_url',
            'transaction_id',
            'created_at',
            'updated_at',
            'paid_at',
        ]
        read_only_fields = [
            'id',
            'order',
            'user',
            'amount',
            'status',
            'qr_code_url',
            'transaction_id',
            'created_at',
            'updated_at',
            'paid_at',
        ]
    
    def create(self, validated_data):
        """Создаёт платёж с генерацией QR кода"""
        order_id = validated_data.pop('order_id')
        
        from orders.models import Order
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            raise serializers.ValidationError({
                'order_id': 'Заказ не найден'
            })
        
        request = self.context.get('request')
        if request and order.buyer != request.user:
            raise serializers.ValidationError({
                'order_id': 'Вы не можете создать платёж для чужого заказа'
            })
        
        payment = Payment.objects.create(
            order=order,
            user=request.user if request else order.buyer,
            amount=order.total_price,
            payment_method=validated_data.get('payment_method', 'sbp'),
        )
        
        payment.generate_qr_code()
        
        return payment