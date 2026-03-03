# apps/payments/models.py
from django.db import models

class PaymentTransaction(models.Model):
    STATUS_CHOICES = [
        ("pending", "В обработке"), ("success", "Успешно"),
        ("failed", "Ошибка"), ("refunded", "Возврат"),
    ]
    order = models.ForeignKey("orders.Order", on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    payment_method = models.CharField(max_length=50, blank=True)
    transaction_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    response_data = models.JSONField(blank=True, default=dict)

    class Meta:
        verbose_name = "платёжная транзакция"
        verbose_name_plural = "платёжные транзакции"
        ordering = ["-created_at"]