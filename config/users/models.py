from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="users/avatars/", blank=True, null=True)
    is_creator = models.BooleanField(default=False)
    subscriptions = models.ManyToManyField("self", symmetrical=False, related_name="subscribers", blank=True)

    # Переопределяем группы и права с уникальными related_name
    groups = models.ManyToManyField(
        "auth.Group",
        verbose_name="groups",
        blank=True,
        help_text="The groups this user belongs to.",
        related_name="custom_user_set",
        related_query_name="custom_user",
    )
    user_permissions = models.ManyToManyField(
        "auth.Permission",
        verbose_name="user permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        related_name="custom_user_set",
        related_query_name="custom_user",
    )

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"