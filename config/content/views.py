# apps/content/views.py
from rest_framework import viewsets, permissions, filters
from .models import Post, MediaFile
from .serializers import PostSerializer, MediaFileSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.filter(is_published=True)
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content']
    ordering_fields = ['created_at']

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class MediaFileViewSet(viewsets.ModelViewSet):
    queryset = MediaFile.objects.all()
    serializer_class = MediaFileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]