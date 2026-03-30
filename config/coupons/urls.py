from rest_framework.routers import DefaultRouter
from .views import CouponViewSet

router = DefaultRouter()
router.register(r'', CouponViewSet, basename='coupon')

urlpatterns = router.urls