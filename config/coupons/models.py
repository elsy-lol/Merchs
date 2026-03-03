# apps/coupons/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [("percent", "Процент"), ("fixed", "Фиксированная сумма")]
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    valid_from = models.DateTimeField(default=timezone.now)
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=True)
    max_uses = models.PositiveIntegerField(default=1)
    used_count = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "промокод"
        verbose_name_plural = "промокоды"
        ordering = ["-valid_from"]

    def is_valid(self):
        now = timezone.now()
        return (self.active and
                self.valid_from <= now <= self.valid_to and
                self.used_count < self.max_uses)


class Promotion(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    discount_percent = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        blank=True, null=True
    )
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "акция"
        verbose_name_plural = "акции"
        ordering = ["-start_date"]