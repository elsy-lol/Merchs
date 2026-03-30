from django.db import models
from django.conf import settings

class Review(models.Model):
    product = models.ForeignKey('shop.Product', on_delete=models.CASCADE, related_name='reviews')  # ✅ Исправлено
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    order = models.ForeignKey('orders.Order', null=True, blank=True, on_delete=models.SET_NULL)  # ✅ Исправлено
    
    rating = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=255, blank=True)
    content = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['product', 'author']