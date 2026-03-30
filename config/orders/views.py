from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(buyer=user)

    @transaction.atomic
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user, status='pending')

    @action(detail=True, methods=['post'])
    def confirm_receipt(self, request, pk=None):
        """Покупатель подтверждает получение товара"""
        order = self.get_object()
        if order.buyer != request.user:
            return Response({'error': 'Нет прав'}, status=403)
        if order.status != 'shipped':
            return Response({'error': 'Заказ еще не отправлен'}, status=400)
        order.status = 'delivered'
        order.save()
        return Response({'message': 'Товар получен'})

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Отмена заказа"""
        order = self.get_object()
        if order.buyer != request.user and not request.user.is_staff:
            return Response({'error': 'Нет прав'}, status=403)
        if order.status not in ['pending', 'paid']:
            return Response({'error': 'Нельзя отменить'}, status=400)
        order.status = 'cancelled'
        order.save()
        return Response({'message': 'Заказ отменен'})

    @action(detail=False, methods=['get'])
    def my_sales(self, request):
        """Заказы, где пользователь является продавцом (секонд-хенд)"""
        from shop.models import Product
        products = Product.objects.filter(owner=request.user)
        orders = Order.objects.filter(items__product__in=products).distinct()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)