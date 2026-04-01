from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator

# ✅ Жёстко указываем модель через строку
User = get_user_model()

class ProfileSerializerV2(serializers.ModelSerializer):
    """Новый сериализатор для профиля"""
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
        ]
        read_only_fields = ['id', 'seller_rating', 'balance']