from django.db import models
from django.conf import settings

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает'),
        ('succeeded', 'Успешно'),
        ('failed', 'Ошибка'),
        ('refunded', 'Возврат'),
    ]

    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE)  # ✅ Исправлено
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)