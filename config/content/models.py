# apps/content/models.py
from django.db import models

class Post(models.Model):
    creator = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="posts",
        limit_choices_to={"is_creator": True}
    )
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        verbose_name = "пост"
        verbose_name_plural = "посты"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class MediaFile(models.Model):
    FILE_TYPES = [("audio", "Аудио"), ("video", "Видео"), ("image", "Изображение"), ("other", "Другое")]
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="media_files")
    file = models.FileField(upload_to="content/media/")
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "медиафайл"
        verbose_name_plural = "медиафайлы"