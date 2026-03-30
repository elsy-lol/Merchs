from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Favorite, ViewLog
from .serializers import FavoriteSerializer, ViewLogSerializer

class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        product_id = request.data.get('product')
        favorite, created = Favorite.objects.get_or_create(user=request.user, product_id=product_id)
        if not created:
            favorite.delete()
            return Response({'status': 'removed'})
        return Response({'status': 'added'})

    @action(detail=False, methods=['get'])
    def my_favorites(self, request):
        favorites = Favorite.objects.filter(user=request.user)
        serializer = self.get_serializer(favorites, many=True)
        return Response(serializer.data)

class ViewLogViewSet(viewsets.ModelViewSet):
    serializer_class = ViewLogSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)