from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    author_avatar = serializers.ImageField(source='author.avatar', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'author', 'author_username', 'author_avatar', 'rating', 'title', 'content', 'created_at']
        read_only_fields = ['author', 'created_at']

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['product', 'rating', 'title', 'content']