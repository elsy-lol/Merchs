from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogPost, Announcement
from .serializers import BlogPostSerializer, AnnouncementSerializer
from common.permissions import IsStaffOrReadOnly

class BlogPostViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsStaffOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_published']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'views']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return BlogPost.objects.all()
        return BlogPost.objects.filter(is_published=True)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.filter(is_active=True)
    serializer_class = AnnouncementSerializer
    permission_classes = [permissions.AllowAny]