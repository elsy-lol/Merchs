# apps/cart/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem
from shop.models import ProductVariant

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='variant.product.name', read_only=True)
    size = serializers.CharField(source='variant.size', read_only=True)
    color = serializers.CharField(source='variant.color', read_only=True)
    price = serializers.DecimalField(source='variant.effective_price', max_digits=10, decimal_places=2, read_only=True)
    total = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'variant', 'quantity', 'product_name', 'size', 'color', 'price', 'total']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'session_key', 'created_at', 'updated_at', 'items', 'total_price']

    def get_total_price(self, obj):
        return sum(item.total_price for item in obj.items.all())


class AddToCartSerializer(serializers.Serializer):
    variant_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)

    def validate_variant_id(self, value):
        if not ProductVariant.objects.filter(id=value).exists():
            raise serializers.ValidationError("Variant does not exist")
        return value