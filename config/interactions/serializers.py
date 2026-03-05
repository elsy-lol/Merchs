# apps/interactions/serializers.py
from rest_framework import serializers
from .models import Wishlist, Like

class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.main_image', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'user', 'product', 'product_name', 'product_image', 'created_at']
        read_only_fields = ['user']


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'product', 'created_at']
        read_only_fields = ['user']