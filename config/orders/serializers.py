from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.images.first.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'variant', 'quantity', 'price', 'seller']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    buyer_username = serializers.CharField(source='buyer.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'buyer', 'buyer_username', 'total_amount', 'status',
            'shipping_address', 'tracking_number', 'items', 'created_at', 'updated_at'
        ]

class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(child=serializers.DictField())

    class Meta:
        model = Order
        fields = ['shipping_address', 'items']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        
        order = Order.objects.create(buyer=request.user, **validated_data)
        total = 0
        
        for item in items_data:
            product = item['product']
            price = product.price
            total += price * item['quantity']
            
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity'],
                price=price,
                seller=product.owner
            )
            
        order.total_amount = total
        order.save()
        return order