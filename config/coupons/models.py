from django.db import models
from django.utils import timezone

class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=[('percent', 'Процент'), ('fixed', 'Фикс')])
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    usage_count = models.PositiveIntegerField(default=0)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return self.expires_at and self.expires_at < timezone.now()

    def is_valid(self):
        return self.is_active and not self.is_expired() and (not self.max_uses or self.usage_count < self.max_uses)