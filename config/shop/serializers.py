from rest_framework import serializers
from .models import Creator, Category, Product, ProductVariant, ProductImage

class CreatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Creator
        fields = ['id', 'name', 'slug', 'description', 'logo', 'social_links']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main', 'order']

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'stock', 'sku']

class ProductSerializer(serializers.ModelSerializer):
    creator = CreatorSerializer(read_only=True)
    owner = serializers.StringRelatedField(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'product_type', 
            'creator', 'owner', 'category', 'category_name', 
            'status', 'condition', 'is_negotiable', 'views',
            'images', 'variants', 'created_at', 'updated_at'
        ]

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)
    variants = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'product_type', 
            'creator', 'category', 'condition', 'is_negotiable',
            'images', 'variants'
        ]

    def validate(self, data):
        product_type = data.get('product_type')
        if product_type == 'official' and not data.get('creator'):
            raise serializers.ValidationError({"creator": "Для мерча нужно выбрать блогера"})
        if product_type == 'second_hand' and not data.get('condition'):
            raise serializers.ValidationError({"condition": "Для секонда нужно указать состояние"})
        return data

    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])
        
        product = Product.objects.create(**validated_data)
        
        for image in images_data:
            ProductImage.objects.create(product=product, image=image)
            
        for variant in variants_data:
            ProductVariant.objects.create(product=product, **variant)
            
        return product

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])
        variants_data = validated_data.pop('variants', [])
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if images_data:
            instance.images.all().delete()
            for image in images_data:
                ProductImage.objects.create(product=instance, image=image)
                
        return instance