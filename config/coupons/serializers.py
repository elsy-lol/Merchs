from rest_framework import serializers
from .models import Coupon

class CouponSerializer(serializers.ModelSerializer):
    is_expired = serializers.BooleanField(read_only=True)
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = Coupon
        fields = ['id', 'code', 'discount_type', 'discount_value', 'min_order_amount', 'max_uses', 'usage_count', 'expires_at', 'is_active', 'is_expired', 'is_valid']

class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField()