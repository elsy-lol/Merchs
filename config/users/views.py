from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Creator, Category, Product, ProductVariant, ProductImage
from .serializers import (
    CreatorSerializer, CategorySerializer, ProductSerializer, 
    ProductCreateUpdateSerializer, ProductVariantSerializer, ProductImageSerializer
)
from common.permissions import IsOwnerOrReadOnly, IsStaffOrReadOnly

class CreatorViewSet(viewsets.ModelViewSet):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsStaffOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']  # ✅ Исправление предупреждения
    ordering = ['name']  # ✅ Сортировка по умолчанию

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']  # ✅ Исправление предупреждения
    ordering = ['name']  # ✅ Сортировка по умолчанию

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'creator', 'product_type', 'status']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'updated_at', 'views']
    ordering = ['-created_at']  # ✅ Сначала новые

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductSerializer

    def get_queryset(self):
        user = self.request.user
        
        # Если пользователь не авторизован - показываем только опубликованные
        if not user.is_authenticated:
            return Product.objects.filter(status='published')
        
        # Если пользователь админ - показываем всё
        if user.is_staff:
            return Product.objects.all()
        
        # Если пользователь авторизован - показываем опубликованные + его товары
        return Product.objects.filter(Q(status='published') | Q(owner=user))

    def perform_create(self, serializer):
        is_official = serializer.validated_data.get('product_type') == 'official'
        if is_official and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Только администрация может добавлять официальный мерч.")
        if is_official:
            serializer.save(status='published')
        else:
            serializer.save(owner=self.request.user, status='pending')

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        product = serializer.validated_data.get('product')
        if product.owner and product.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Нельзя добавлять варианты к чужому товару.")
        serializer.save()

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        product = serializer.validated_data.get('product')
        if product.owner and product.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("Нельзя добавлять фото к чужому товару.")
        serializer.save()