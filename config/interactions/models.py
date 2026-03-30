from django.db import models
from django.conf import settings

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey('shop.Product', on_delete=models.CASCADE)  # ✅ Исправлено
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'product']

class ViewLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    product = models.ForeignKey('shop.Product', on_delete=models.CASCADE)  # ✅ Исправлено
    viewed_at = models.DateTimeField(auto_now_add=True)