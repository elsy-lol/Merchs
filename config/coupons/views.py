# apps/coupons/views.py
from rest_framework import viewsets, permissions
from .models import Coupon, Promotion
from .serializers import CouponSerializer, PromotionSerializer

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]  # Только админ может управлять промокодами

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [permissions.IsAdminUser]