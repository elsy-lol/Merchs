# config/payments/models.py

from django.db import models
from django.conf import settings
import uuid
from django.utils import timezone


class Payment(models.Model):
    """Платёж заказа"""
    STATUS_CHOICES = [
        ('pending', 'Ожидает оплаты'),
        ('completed', 'Оплачен'),
        ('failed', 'Не удался'),
        ('refunded', 'Возвращён'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('sbp', 'СБП'),
        ('card', 'Банковская карта'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD_CHOICES, default='sbp')  # ✅ Это поле должно быть!
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    qr_code_url = models.URLField(blank=True, null=True)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Платёж'
        verbose_name_plural = 'Платежи'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'Платёж {self.id} - {self.amount} ₽ - {self.status}'
    
    def generate_qr_code(self):
        """Генерирует фейковый QR код для СБП"""
        import random
        import string
        
        self.transaction_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
        self.qr_code_url = f"https://qr.sbp.ru/pay/{self.transaction_id}"
        self.save()
        return self.qr_code_url