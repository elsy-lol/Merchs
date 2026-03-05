# apps/content/serializers.py
from rest_framework import serializers
from .models import Post, MediaFile

class MediaFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaFile
        fields = ['id', 'file', 'file_type', 'uploaded_at']


class PostSerializer(serializers.ModelSerializer):
    media_files = MediaFileSerializer(many=True, read_only=True)
    creator_username = serializers.CharField(source='creator.username', read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'creator', 'creator_username', 'title', 'content',
                  'created_at', 'updated_at', 'is_published', 'media_files']