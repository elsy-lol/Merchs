# config/users/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from django.db.models import Q
from .serializers import UserSerializer, UserRegistrationSerializer, ProfileSerializer, LoginSerializer
from .email_utils import send_2fa_email
import logging
import traceback
import random

logger = logging.getLogger(__name__)

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
        if self.action in ['create', 'register', 'login', 'refresh', 'verify_login_2fa', 'resend_2fa']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        """✅ Вход с поддержкой 2FA"""
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response({'detail': 'Неверные данные'}, status=status.HTTP_400_BAD_REQUEST)
            
            username_or_email = serializer.validated_data.get('username').strip().lower()
            password = serializer.validated_data.get('password')
            
            user = User.objects.filter(Q(username__iexact=username_or_email) | Q(email__iexact=username_or_email)).first()
            
            if not user or not authenticate(username=user.username, password=password):
                return Response({'detail': 'Неверное имя пользователя или пароль'}, status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.is_active:
                return Response({'detail': 'Аккаунт не активен'}, status=status.HTTP_401_UNAUTHORIZED)

            if user.is_2fa_enabled:
                code = str(random.randint(100000, 999999))
                user.two_factor_code = code
                user.save()
                
                method = user.two_factor_method
                if method == 'email':
                    send_2fa_email(user.email, code)
                
                return Response({
                    'two_factor_required': True,
                    'method': method,
                    'username': user.username
                }, status=status.HTTP_200_OK)

            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f'❌ Login error: {str(e)}')
            return Response({'detail': 'Ошибка сервера'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='resend-2fa')
    def resend_2fa(self, request):
        """✅ Повторная отправка кода (универсальная)"""
        username = request.data.get('username')
        
        # Если пользователь авторизован, берем его никнейм
        if not username and request.user.is_authenticated:
            user = request.user
        else:
            user = User.objects.filter(username=username).first()
        
        if not user:
            return Response({'detail': 'Пользователь не найден'}, status=status.HTTP_404_NOT_FOUND)
            
        code = str(random.randint(100000, 999999))
        user.two_factor_code = code
        user.save()
        
        # Если метод еще не установлен (активация), используем переданный или email по умолчанию
        method = user.two_factor_method if user.two_factor_method != 'none' else 'email'
        
        if method == 'email':
            send_2fa_email(user.email, code)
            
        return Response({'detail': 'Код отправлен повторно'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='verify-login-2fa', permission_classes=[permissions.AllowAny])
    def verify_login_2fa(self, request):
        username = request.data.get('username')
        code = request.data.get('code')
        user = User.objects.filter(username=username).first()
        
        if user and user.two_factor_code == code:
            user.two_factor_code = None
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Неверный код'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='toggle-2fa', permission_classes=[permissions.IsAuthenticated])
    def toggle_2fa(self, request):
        """✅ Запрос на активацию 2FA"""
        method = request.data.get('method')
        if method == 'none':
            request.user.is_2fa_enabled = False
            request.user.two_factor_method = 'none'
            request.user.save()
            return Response({'detail': '2FA отключена'}, status=status.HTTP_200_OK)

        # Генерируем код для подтверждения ПРИВЯЗКИ
        code = str(random.randint(100000, 999999))
        request.user.two_factor_code = code
        request.user.save()

        if method == 'email':
            send_2fa_email(request.user.email, code)
        
        return Response({'detail': 'Код подтверждения отправлен на почту', 'method': method}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='verify-2fa', permission_classes=[permissions.IsAuthenticated])
    def verify_2fa(self, request):
        """✅ Окончательная привязка 2FA после ввода кода"""
        code = request.data.get('code')
        method = request.data.get('method', 'email')
        
        if request.user.two_factor_code == code:
            request.user.is_2fa_enabled = True
            request.user.two_factor_method = method
            request.user.two_factor_code = None
            request.user.save()
            return Response({'detail': '2FA успешно активирована!'}, status=status.HTTP_200_OK)
        
        return Response({'detail': 'Неверный код подтверждения'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='profile', permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'GET':
            return Response(UserSerializer(request.user).data)
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], url_path='change-password', permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        from .serializers import PasswordChangeSerializer
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            if not request.user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Неверный пароль"]}, status=status.HTTP_400_BAD_REQUEST)
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            return Response({"detail": "Пароль изменен"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)