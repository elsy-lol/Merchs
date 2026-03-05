# apps/shop/serializers.py
from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductVariantSerializer(serializers.ModelSerializer):
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'price_override', 'stock', 'effective_price']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main']


class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    additional_images = ProductImageSerializer(many=True, read_only=True)
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'creator', 'creator_username',
            'name', 'slug', 'description', 'price', 'main_image',
            'created_at', 'updated_at', 'available', 'variants', 'additional_images'
        ]


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'category', 'creator', 'name', 'description', 'price',
            'main_image', 'available'
        ]