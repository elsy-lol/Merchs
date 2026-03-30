from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, payment_webhook

router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = router.urls + [
    path('webhook/', payment_webhook, name='payment_webhook'),
]