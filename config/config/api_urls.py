from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# Твои импорты
from shop.views import CategoryViewSet, ProductViewSet, ProductVariantViewSet, ProductImageViewSet
from users.views import UserViewSet
from content.views import PostViewSet, MediaFileViewSet
from cart.views import CartViewSet, CartItemViewSet
from orders.views import OrderViewSet
from payments.views import PaymentTransactionViewSet
from reviews.views import ReviewViewSet
from interactions.views import WishlistViewSet, LikeViewSet
from coupons.views import CouponViewSet, PromotionViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'variants', ProductVariantViewSet)
router.register(r'images', ProductImageViewSet)
router.register(r'posts', PostViewSet)
router.register(r'media', MediaFileViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet, basename='cartitem')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'payments', PaymentTransactionViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'coupons', CouponViewSet)
router.register(r'promotions', PromotionViewSet)

urlpatterns = [
    # Админка Django
    path('admin/', admin.site.urls),
    
    # Авторизация в браузере для DRF (кнопка Login в API браузере)
    path('api-auth/', include('rest_framework.urls')),
    
    # Все API маршруты под префиксом /api/
    # Теперь твои продукты будут доступны по адресу /api/products/
    path('api/', include(router.urls)),
]

# Отдача медиа-файлов (фото товаров) в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    # Если будешь использовать Swagger/Redoc документацию (рекомендую для такого большого API)
    # urlpatterns += [path('api/docs/', include('drf_spectacular.urls'))]