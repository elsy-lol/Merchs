from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'role']
        read_only_fields = ['id', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()
    listings_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'phone', 'avatar', 'role', 'bio', 'is_verified_seller',
            'seller_rating', 'balance', 'orders_count', 'listings_count'
        ]
        read_only_fields = ['email', 'seller_rating', 'balance']

    def get_orders_count(self, obj):
        return obj.orders.count()

    def get_listings_count(self, obj):
        return obj.listings.filter(status='published').count()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user