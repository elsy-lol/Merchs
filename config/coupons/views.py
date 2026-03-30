from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Coupon
from .serializers import CouponSerializer, CouponValidateSerializer

class CouponViewSet(viewsets.ModelViewSet):
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Coupon.objects.all()

    @action(detail=False, methods=['post'])
    def validate(self, request):
        """Проверка промокода пользователем"""
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data.get('code')
        try:
            coupon = Coupon.objects.get(code=code)
            if coupon.is_expired() or coupon.usage_count >= coupon.max_uses:
                return Response({'valid': False, 'message': 'Купон недействителен'}, status=400)
            return Response({'valid': True, 'discount': coupon.discount_value})
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'message': 'Купон не найден'}, status=404)