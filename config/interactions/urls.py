from rest_framework.routers import DefaultRouter
from .views import FavoriteViewSet, ViewLogViewSet

router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'views', ViewLogViewSet, basename='viewlog')

urlpatterns = router.urls