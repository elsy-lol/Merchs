from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'amount', 'payment_id', 'status', 'payment_url', 'created_at']
        read_only_fields = ['payment_id', 'status', 'payment_url']

class PaymentCreateSerializer(serializers.ModelSerializer):
    order_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Payment
        fields = ['order_id', 'amount']