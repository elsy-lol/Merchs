from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserRegistrationSerializer, ProfileSerializer

# ✅ ИМПОРТЫ ИЗ ПРАВИЛЬНЫХ ПРИЛОЖЕНИЙ!
from shop.models import Product
from shop.serializers import ProductSerializer
from orders.models import Order
from orders.serializers import OrderSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet для управления пользователями"""
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action in ['update', 'partial_update', 'me']:
            return ProfileSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'register']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='profile')
    def me(self, request):
        """Получить/обновить текущий профиль пользователя"""
        if request.method == 'GET':
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        elif request.method in ['PUT', 'PATCH']:
            serializer = ProfileSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my_listings')
    def my_listings(self, request):
        """Получить мои товары (для продавцов)"""
        listings = Product.objects.filter(owner=request.user)
        serializer = ProductSerializer(listings, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='my_orders')
    def my_orders(self, request):
        """Получить мои заказы"""
        orders = Order.objects.filter(buyer=request.user)
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response(serializer.data)