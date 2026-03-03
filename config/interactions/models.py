# apps/interactions/models.py
from django.db import models

class Wishlist(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="wishlist_items")
    product = models.ForeignKey("shop.Product", on_delete=models.CASCADE, related_name="in_wishlists")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "избранное"
        verbose_name_plural = "избранное"
        unique_together = ["user", "product"]
        ordering = ["-created_at"]


class Like(models.Model):
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="likes")
    product = models.ForeignKey("shop.Product", on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "лайк"
        verbose_name_plural = "лайки"
        unique_together = ["user", "product"]
        ordering = ["-created_at"]