# apps/reviews/views.py
from rest_framework import viewsets, permissions, filters
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['comment']
    ordering_fields = ['created_at', 'rating']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)