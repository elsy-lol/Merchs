# apps/reviews/serializers.py
from rest_framework import serializers
from .models import Review, ReviewPhoto

class ReviewPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewPhoto
        fields = ['id', 'image']


class ReviewSerializer(serializers.ModelSerializer):
    photos = ReviewPhotoSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'user_username', 'rating', 'comment', 'created_at', 'updated_at', 'photos']