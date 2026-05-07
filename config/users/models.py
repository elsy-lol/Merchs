from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('buyer', 'Покупатель'),
        ('seller', 'Продавец'),
        ('both', 'И то и другое'),
    ]
    
    
    TWO_FACTOR_CHOICES = [
        ('none', 'Выключено'),
        ('email', 'Электронная почта'),
        ('sms', 'SMS'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='buyer')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_verified_seller = models.BooleanField(default=False)
    seller_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    bio = models.TextField(blank=True)
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    is_2fa_enabled = models.BooleanField(default=False)
    two_factor_method = models.CharField(max_length=10, choices=TWO_FACTOR_CHOICES, default='none')
    two_factor_code = models.CharField(max_length=6, blank=True, null=True)
    
    # Переопределяем группы и разрешения
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permission_set',
        blank=True
    )

    def __str__(self):
        return self.username