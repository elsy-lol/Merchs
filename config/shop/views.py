from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Creator, Category, Product, ProductVariant, ProductImage, Wishlist  # ✅ Модели
from .serializers import (  # ✅ Сериализаторы отдельно
    CreatorSerializer, CategorySerializer, ProductSerializer, 
    ProductCreateUpdateSerializer, ProductVariantSerializer, 
    ProductImageSerializer, WishlistSerializer
)
from common.permissions import IsOwnerOrReadOnly, IsStaffOrReadOnly

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']  # ✅ Добавь
    ordering = ['name']  # ✅ Добавь

class CreatorViewSet(viewsets.ModelViewSet):
    queryset = Creator.objects.all()
    serializer_class = CreatorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsStaffOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    ordering_fields = ['name', 'id']  # ✅ Добавь
    ordering = ['name']  # ✅ Добавь

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
        
        # ✅ Если пользователь не авторизован - показываем только опубликованные
        if not user.is_authenticated:
            return Product.objects.filter(status='published')
        
        # ✅ Если пользователь админ - показываем всё
        if user.is_staff:
            return Product.objects.all()
        
        # ✅ Если пользователь авторизован - показываем опубликованные + его товары
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

from .models import Wishlist

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    """Избранное пользователя"""
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """✅ Возвращаем избранное текущего пользователя"""
        user = self.request.user
        queryset = Wishlist.objects.filter(user=user).select_related(
            'product', 
            'product__creator', 
            'product__category'
        ).order_by('-added_at')
        
        # Фильтрация по product_id
        product_id = self.request.query_params.get('product_id', None)
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        return queryset
    
    def get_serializer_context(self):
        """✅ Передаём request в сериализатор"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        """✅ Обработка создания с правильным ответом"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # ✅ Возвращаем 200 OK вместо 201
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        """✅ Удаление с правильным статусом"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)