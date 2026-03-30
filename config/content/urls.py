from rest_framework.routers import DefaultRouter
from .views import BlogPostViewSet, AnnouncementViewSet

router = DefaultRouter()
router.register(r'posts', BlogPostViewSet, basename='blogpost')
router.register(r'announcements', AnnouncementViewSet, basename='announcement')

urlpatterns = router.urls