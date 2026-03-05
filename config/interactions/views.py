# apps/interactions/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Wishlist, Like
from .serializers import WishlistSerializer, LikeSerializer
from shop.models import Product

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['delete'], url_path='remove/(?P<product_id>\d+)')
    def remove_by_product(self, request, product_id=None):
        wishlist_item = self.get_queryset().filter(product_id=product_id).first()
        if wishlist_item:
            wishlist_item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Like.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['delete'], url_path='remove/(?P<product_id>\d+)')
    def remove_by_product(self, request, product_id=None):
        like = self.get_queryset().filter(product_id=product_id).first()
        if like:
            like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({'error': 'Like not found'}, status=status.HTTP_404_NOT_FOUND)