from rest_framework import serializers
from .models import BlogPost, Announcement

class BlogPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'content', 'author', 'author_username', 'category', 'is_published', 'views', 'created_at', 'updated_at']

class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'is_active', 'created_at', 'expires_at']