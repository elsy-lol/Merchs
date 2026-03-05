from rest_framework.routers import DefaultRouter

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

urlpatterns = router.urls