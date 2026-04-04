# config/users/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
import re

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """✅ Сериализатор пользователя (для чтения)"""
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_verified_seller',
            'seller_rating',
            'bio',
            'balance',
            'avatar',
            'date_joined',
        ]
        read_only_fields = [
            'id',
            'seller_rating',
            'balance',
            'date_joined',
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """✅ Сериализатор регистрации"""
    password = serializers.CharField(
        write_only=True, 
        required=True,
        min_length=6,
        style={'input_type': 'password'},
        error_messages={
            'min_length': 'Пароль должен быть не менее 6 символов',
            'required': 'Пароль обязателен',
        }
    )
    password_confirm = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'},
        error_messages={
            'required': 'Подтверждение пароля обязательно',
        }
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(
            queryset=User.objects.all(), 
            message='Пользователь с таким email уже существует'
        )]
    )
    username = serializers.CharField(
        required=True,
        min_length=3,
        max_length=150,
        validators=[UniqueValidator(
            queryset=User.objects.all(), 
            message='Такое имя пользователя уже занято'
        )],
        error_messages={
            'min_length': 'Имя пользователя должно быть не менее 3 символов',
            'max_length': 'Имя пользователя не должно превышать 150 символов',
            'required': 'Имя пользователя обязательно',
        }
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
            'role',
        ]
        extra_kwargs = {
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'role': {'required': False},
        }

    def validate_username(self, value):
        """✅ Очищаем username от недопустимых символов"""
        value = value.strip().lower()
        # Заменяем недопустимые символы на подчёркивание
        value = re.sub(r'[^a-zA-Z0-9@./+\-_]', '_', value)
        
        if len(value) < 3:
            raise serializers.ValidationError('Имя пользователя должно быть не менее 3 символов')
        
        return value

    def validate(self, attrs):
        """Проверяем, что пароли совпадают"""
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': 'Пароли не совпадают'
            })
        return attrs

    def create(self, validated_data):
        """Создаём пользователя"""
        validated_data.pop('password_confirm', None)
        return User.objects.create_user(**validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    """✅ Сериализатор профиля (для обновления)"""
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'is_verified_seller',
            'seller_rating',
            'bio',
            'balance',
            'avatar',
        ]
        read_only_fields = [
            'id',
            'seller_rating',
            'balance',
        ]


class LoginSerializer(serializers.Serializer):
    """✅ Сериализатор входа"""
    username = serializers.CharField(
        required=True, 
        write_only=True,
        error_messages={
            'required': 'Имя пользователя или email обязателен',
        }
    )
    password = serializers.CharField(
        required=True, 
        write_only=True, 
        style={'input_type': 'password'},
        error_messages={
            'required': 'Пароль обязателен',
        }
    )

    def validate_username(self, value):
        # ✅ Разрешаем и username, и email
        return value.strip().lower()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if not username or not password:
            raise serializers.ValidationError('Имя пользователя и пароль обязательны')

        return attrs