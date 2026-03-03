# apps/orders/models.py
from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Ожидает оплаты"), ("paid", "Оплачен"), ("processing", "В обработке"),
        ("shipped", "Отправлен"), ("delivered", "Доставлен"), ("cancelled", "Отменён"),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="orders"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    shipping_address = models.TextField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "заказ"
        verbose_name_plural = "заказы"
        ordering = ["-created_at"]


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_variant = models.ForeignKey("shop.ProductVariant", on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)
    variant_display = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()

    class Meta:
        verbose_name = "позиция заказа"
        verbose_name_plural = "позиции заказа"

    @property
    def total_price(self):
        return self.price * self.quantity