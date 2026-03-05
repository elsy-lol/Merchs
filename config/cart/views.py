# apps/cart/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer, AddToCartSerializer
from shop.models import ProductVariant

class CartViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_object()
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        variant = get_object_or_404(ProductVariant, id=serializer.validated_data['variant_id'])
        quantity = serializer.validated_data['quantity']

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            variant=variant,
            defaults={'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartItemSerializer(cart_item).data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = self.get_object()
        variant_id = request.data.get('variant_id')
        if not variant_id:
            return Response({'error': 'variant_id required'}, status=status.HTTP_400_BAD_REQUEST)

        cart.items.filter(variant_id=variant_id).delete()
        return Response({'status': 'removed'})

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = self.get_object()
        cart.items.all().delete()
        return Response({'status': 'cart cleared'})

class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        serializer.save(cart=cart)