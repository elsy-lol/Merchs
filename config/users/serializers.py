from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

# ✅ Получаем кастомную модель пользователя
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для отображения данных пользователя"""
    class Meta:
        model = User  # ✅ Используем кастомную модель
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
        ]
        read_only_fields = ['id', 'seller_rating', 'balance']

class UserRegistrationSerializer(serializers.ModelSerializer):
    """Сериализатор для регистрации пользователя"""
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User  # ✅ Используем кастомную модель
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
            'first_name': {'required': False},
            'last_name': {'required': False},
            'role': {'required': False},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Пароли не совпадают'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class ProfileSerializer(serializers.ModelSerializer):
    """Сериализатор для профиля пользователя"""
    class Meta:
        model = User  # ✅ Используем кастомную модель
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
        ]
        read_only_fields = ['id', 'seller_rating', 'balance']

    def update(self, instance, validated_data):
        allowed_fields = ['first_name', 'last_name', 'bio', 'email']
        for field in allowed_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        instance.save()
        return instance