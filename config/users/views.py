# config/users/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer, UserRegistrationSerializer, ProfileSerializer, LoginSerializer
import logging
import traceback

logger = logging.getLogger(__name__)

# ✅ ВСЕГДА используем get_user_model()
User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet для управления пользователями"""
    queryset = User.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return UserRegistrationSerializer
        elif self.action in ['update', 'partial_update', 'me']:
            return ProfileSerializer
        elif self.action == 'login':
            return LoginSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'register', 'login', 'refresh']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """✅ Вход пользователя с выдачей JWT токенов"""
        try:
            logger.info(f'🔐 Login attempt: data={request.data}')
            
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                logger.warning(f'❌ Serializer errors: {serializer.errors}')
                return Response(
                    {'detail': 'Неверные данные', 'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            username_or_email = serializer.validated_data.get('username').strip().lower()
            password = serializer.validated_data.get('password')
            
            # 🔍 Находим пользователя по username или email
            user = None
            if '@' in username_or_email:
                user = User.objects.filter(email__iexact=username_or_email).first()
                if user:
                    username_or_email = user.username
            else:
                user = User.objects.filter(username__iexact=username_or_email).first()
            
            if not user:
                logger.warning(f'❌ User not found: {username_or_email}')
                return Response(
                    {'detail': 'Неверное имя пользователя или пароль'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            logger.info(f'✅ User found: {user.username}, is_active={user.is_active}')
            
            # ✅ Аутентификация
            authenticated_user = authenticate(username=user.username, password=password)
            
            if not authenticated_user:
                logger.warning(f'❌ Authentication failed for {user.username}')
                return Response(
                    {'detail': 'Неверное имя пользователя или пароль'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            if not authenticated_user.is_active:
                logger.warning(f'❌ User {authenticated_user.username} is not active')
                return Response(
                    {'detail': 'Аккаунт не активен'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            logger.info(f'✅ Login successful for {authenticated_user.username}')
            
            # ✅ Генерация токенов
            refresh = RefreshToken.for_user(authenticated_user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(authenticated_user).data,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f'❌ Login error: {str(e)}')
            logger.error(f'❌ Traceback: {traceback.format_exc()}')
            return Response(
                {'detail': 'Внутренняя ошибка сервера', 'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        """✅ Регистрация нового пользователя"""
        try:
            logger.info(f'📝 Register attempt: data={request.data}')
            
            serializer = UserRegistrationSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            logger.info(f'✅ User registered: {user.username}')
            
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f'❌ Register error: {str(e)}')
            logger.error(f'❌ Traceback: {traceback.format_exc()}')
            return Response(
                {'detail': 'Ошибка регистрации', 'errors': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='profile', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """✅ Получить/обновить текущий профиль пользователя"""
        try:
            if request.method == 'GET':
                serializer = self.get_serializer(request.user)
                return Response(serializer.data)
            elif request.method in ['PUT', 'PATCH']:
                serializer = ProfileSerializer(request.user, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data)
        except Exception as e:
            logger.error(f'❌ Profile error: {str(e)}')
            return Response(
                {'detail': 'Ошибка профиля'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path='my_listings', permission_classes=[permissions.IsAuthenticated])
    def my_listings(self, request):
        """✅ Получить мои товары (для продавцов)"""
        try:
            from shop.models import Product
            from shop.serializers import ProductSerializer
            listings = Product.objects.filter(owner=request.user)
            serializer = ProductSerializer(listings, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            logger.error(f'❌ My listings error: {str(e)}')
            return Response({'detail': 'Ошибка'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='my_orders', permission_classes=[permissions.IsAuthenticated])
    def my_orders(self, request):
        """✅ Получить мои заказы"""
        try:
            from orders.models import Order
            from orders.serializers import OrderSerializer
            orders = Order.objects.filter(buyer=request.user)
            serializer = OrderSerializer(orders, many=True, context={'request': request})
            return Response(serializer.data)
        except Exception as e:
            logger.error(f'❌ My orders error: {str(e)}')
            return Response({'detail': 'Ошибка'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def refresh(self, request):
        """✅ Обновить access токен"""
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response(
                    {'detail': 'Refresh token required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            refresh = RefreshToken(refresh_token)
            return Response({
                'access': str(refresh.access_token),
            })
        except Exception as e:
            logger.error(f'❌ Refresh error: {str(e)}')
            return Response(
                {'detail': 'Invalid refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )