from rest_framework import serializers
from .models import Order, OrderItem
from shop.models import Product, ProductVariant

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    variant = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(), 
        required=False, 
        allow_null=True
    )
    
    class Meta:
        model = OrderItem
        fields = ['product', 'variant', 'quantity', 'price']
        # ✅ price теперь только для чтения!
        read_only_fields = ['price']
    
    def validate_quantity(self, value):
        if value < 1:
            raise serializers.ValidationError('Количество должно быть больше 0')
        return value
    
    def validate(self, attrs):
        product = attrs.get('product')
        variant = attrs.get('variant')
        quantity = attrs.get('quantity')
        
        # Проверка статуса товара
        if product.status != 'published':
            raise serializers.ValidationError({
                'product': f'Товар "{product.name}" недоступен для заказа'
            })
        
        # Вычисляем цену на бэкенде
        if variant:
            if variant.stock < quantity:
                raise serializers.ValidationError({
                    'variant': f'Недостаточно товара (доступно: {variant.stock})'
                })
            attrs['price'] = variant.price
        else:
            # Если нет варианта, берём цену товара
            attrs['price'] = product.price
        
        return attrs

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id',
            'buyer',
            'total_price',
            'status',
            'shipping_address',
            'phone',
            'email',
            'items',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'buyer', 'total_price', 'status', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context['request']
        
        # Создаём заказ
        order = Order.objects.create(
            buyer=request.user,
            status='pending',
            **validated_data
        )
        
        # Создаём элементы заказа
        total = 0
        for item_data in items_data:
            variant = item_data.get('variant')
            if variant:
                variant.stock -= item_data['quantity']
                variant.save()
            
            order_item = OrderItem.objects.create(order=order, **item_data)
            total += item_data['price'] * item_data['quantity']
        
        # Обновляем сумму
        order.total_price = total
        order.save()
        
        return order