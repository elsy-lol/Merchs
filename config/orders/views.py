# apps/orders/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from cart.models import Cart

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def checkout(self, request):
        cart = Cart.objects.filter(user=request.user).first()
        if not cart or not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Создаём заказ из корзины
        order = Order.objects.create(
            user=request.user,
            shipping_address=request.data.get('shipping_address', ''),
            total=sum(item.total_price for item in cart.items.all())
        )

        # Переносим элементы из корзины в заказ
        for cart_item in cart.items.all():
            order.items.create(
                product_variant=cart_item.variant,
                product_name=cart_item.variant.product.name,
                variant_display=f"{cart_item.variant.get_size_display()} {cart_item.variant.color}",
                price=cart_item.variant.effective_price,
                quantity=cart_item.quantity
            )

        # Очищаем корзину
        cart.items.all().delete()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)