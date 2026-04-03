from django.db import models
from django.conf import settings

class Creator(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='creators/', blank=True)
    social_links = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    
    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    PRODUCT_TYPE_CHOICES = [
        ('official', 'Официальный мерч'),
        ('second_hand', 'Секонд-хенд'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('pending', 'На модерации'),
        ('published', 'Опубликовано'),
        ('sold', 'Продано'),
        ('archived', 'Архив'),
    ]
    
    CONDITION_CHOICES = [
        ('new', 'Новое'),
        ('excellent', 'Отличное'),
        ('good', 'Хорошее'),
        ('satisfactory', 'Удовлетворительное'),
    ]

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES, default='official')
    creator = models.ForeignKey(Creator, null=True, blank=True, on_delete=models.SET_NULL, related_name='products')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE, related_name='listings')
    
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, null=True, blank=True)
    is_negotiable = models.BooleanField(default=False)
    
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['status', 'product_type'])]

    def __str__(self):
        return f"{self.name} ({self.product_type})"

class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=10, null=True, blank=True)
    color = models.CharField(max_length=50, null=True, blank=True)
    stock = models.PositiveIntegerField(default=1)
    sku = models.CharField(max_length=100, unique=True, blank=True)

    def __str__(self):
        return f"{self.product.name} - {self.size}/{self.color}"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_main = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

class Wishlist(models.Model):
    """Избранное пользователя"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlist_items')
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'product')
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'
    
    def __str__(self):
        return f'{self.user.username} - {self.product.name}'