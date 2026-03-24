from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

# Импортируем все ViewSet'ы из ваших приложений
from users.views import UserViewSet
from shop.views import CategoryViewSet, ProductViewSet, ProductVariantViewSet, ProductImageViewSet
from content.views import PostViewSet, MediaFileViewSet
from cart.views import CartViewSet, CartItemViewSet
from orders.views import OrderViewSet
from payments.views import PaymentTransactionViewSet
from reviews.views import ReviewViewSet
from interactions.views import WishlistViewSet, LikeViewSet
from coupons.views import CouponViewSet, PromotionViewSet

# Создаём роутер и регистрируем все ViewSet'ы
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'variants', ProductVariantViewSet)
router.register(r'images', ProductImageViewSet)
router.register(r'posts', PostViewSet)
router.register(r'media', MediaFileViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'cart-items', CartItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'payments', PaymentTransactionViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'wishlist', WishlistViewSet)
router.register(r'likes', LikeViewSet)
router.register(r'coupons', CouponViewSet)
router.register(r'promotions', PromotionViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),  # все API будут доступны по префиксу /api/
]

# Добавляем обслуживание медиафайлов в режиме разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)