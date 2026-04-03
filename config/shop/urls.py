from rest_framework.routers import DefaultRouter
from .views import CreatorViewSet, CategoryViewSet, ProductViewSet, ProductVariantViewSet, ProductImageViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'creators', CreatorViewSet, basename='creator')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'variants', ProductVariantViewSet, basename='variant')
router.register(r'images', ProductImageViewSet, basename='image')
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = router.urls