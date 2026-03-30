from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserRegistrationSerializer, ProfileSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action in ['update', 'partial_update', 'profile']:
            return ProfileSerializer
        return UserSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=['get', 'put', 'patch'])
    def profile(self, request):
        """Профиль текущего пользователя"""
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        serializer = self.get_serializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Логаут с инвалидацией токена"""
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'status': 'success'})
        except Exception:
            return Response({'status': 'error'}, status=400)

    @action(detail=False, methods=['get'])
    def my_listings(self, request):
        """Мои товары (секонд-хенд)"""
        from shop.models import Product
        from shop.serializers import ProductSerializer
        products = Product.objects.filter(owner=request.user)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Мои заказы (покупки)"""
        from orders.models import Order
        from orders.serializers import OrderSerializer
        orders = Order.objects.filter(buyer=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)