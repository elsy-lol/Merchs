from rest_framework import serializers
from .models import Favorite, ViewLog

class FavoriteSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.images.first.image', read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'product', 'product_name', 'product_image', 'created_at']

class ViewLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewLog
        fields = ['id', 'user', 'product', 'viewed_at']