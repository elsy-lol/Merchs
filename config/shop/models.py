# apps/shop/models.py
from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, max_length=120)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="shop/categories/", blank=True, null=True)

    class Meta:
        verbose_name = "категория"
        verbose_name_plural = "категории"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="products"
    )
    creator = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="products",
        limit_choices_to={"is_creator": True}
    )
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, max_length=250)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    main_image = models.ImageField(upload_to="shop/products/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    available = models.BooleanField(default=True)

    class Meta:
        verbose_name = "товар"
        verbose_name_plural = "товары"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["slug"]),
            models.Index(fields=["creator"]),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class ProductVariant(models.Model):
    SIZE_CHOICES = [
        ("XS", "XS"), ("S", "S"), ("M", "M"), ("L", "L"),
        ("XL", "XL"), ("XXL", "XXL"), ("ONE_SIZE", "One Size"),
    ]
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, blank=True)
    color = models.CharField(max_length=50, blank=True)
    price_override = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        validators=[MinValueValidator(0)]
    )
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name = "вариация товара"
        verbose_name_plural = "вариации товара"
        unique_together = ["product", "size", "color"]

    def __str__(self):
        parts = [self.product.name]
        if self.size:
            parts.append(f"Размер: {self.get_size_display()}")
        if self.color:
            parts.append(f"Цвет: {self.color}")
        return " | ".join(parts)

    @property
    def effective_price(self):
        return self.price_override if self.price_override else self.product.price


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="additional_images")
    image = models.ImageField(upload_to="shop/products/additional/")
    is_main = models.BooleanField(default=False)

    class Meta:
        verbose_name = "изображение товара"
        verbose_name_plural = "изображения товара"