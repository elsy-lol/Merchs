# apps/users/serializers.py
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'bio', 'avatar', 'is_creator', 'subscriptions'
        ]
        read_only_fields = ['id']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'bio', 'avatar', 'is_creator']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            bio=validated_data.get('bio', ''),
            avatar=validated_data.get('avatar', None),
            is_creator=validated_data.get('is_creator', False)
        )
        return user


class CreatorProfileSerializer(serializers.ModelSerializer):
    """Для отображения блогеров с их мерчем и постами (можно добавить позже)"""
    class Meta:
        model = User
        fields = ['id', 'username', 'avatar', 'bio', 'is_creator']