import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from shop.models import Category, Product, ProductVariant, ProductImage
from users.models import User
from reviews.models import Review
from interactions.models import Like, Wishlist

User = get_user_model()

class Command(BaseCommand):
    help = 'Loads test data for merch shop'

    def handle(self, *args, **options):
        self.stdout.write('Loading test data...')

        # 1. Создаём пользователей
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123',
            is_creator=True
        )
        creator1 = User.objects.create_user(
            username='blogger_ivan',
            email='ivan@example.com',
            password='testpass',
            is_creator=True,
            bio='Музыкант, автор песен'
        )
        creator2 = User.objects.create_user(
            username='music_anna',
            email='anna@example.com',
            password='testpass',
            is_creator=True,
            bio='Певица и композитор'
        )
        user1 = User.objects.create_user(
            username='fan_alex',
            email='alex@example.com',
            password='testpass',
            bio='Люблю музыку'
        )
        user2 = User.objects.create_user(
            username='fan_olga',
            email='olga@example.com',
            password='testpass',
            bio='Коллекционирую мерч'
        )

        # 2. Категории
        categories = []
        for cat_name in ['Футболки', 'Худи', 'Плакаты', 'Аксессуары']:
            cat = Category.objects.create(
                name=cat_name,
                slug=slugify(cat_name),
                description=f'Категория {cat_name}'
            )
            categories.append(cat)

        # 3. Товары
        products = []

        # Товар 1: Футболка от блогера Ивана
        prod1 = Product.objects.create(
            category=categories[0],
            creator=creator1,
            name='Футболка "Рок-звезда"',
            slug='futbolka-rok-zvezda',
            description='Классическая футболка с принтом "Рок-звезда" от блогера Ивана',
            price=Decimal('29.99'),
            main_image='shop/products/futbolka1.png',  # реальный файл нужно будет положить в media
            available=True
        )
        # Вариации: размеры
        for size in ['S', 'M', 'L', 'XL']:
            ProductVariant.objects.create(
                product=prod1,
                size=size,
                color='Черный',
                stock=random.randint(5, 20)
            )
        products.append(prod1)

        # Товар 2: Худи от Анны
        prod2 = Product.objects.create(
            category=categories[1],
            creator=creator2,
            name='Худи "Анна"',
            slug='hudi-anna',
            description='Тёплое худи с вышивкой логотипа Анны',
            price=Decimal('59.99'),
            main_image='shop/products/hudi1.png',
            available=True
        )
        for size in ['S', 'M', 'L']:
            ProductVariant.objects.create(
                product=prod2,
                size=size,
                color='Серый',
                stock=random.randint(3, 10)
            )
        products.append(prod2)

        # Товар 3: Плакат с Иваном
        prod3 = Product.objects.create(
            category=categories[2],
            creator=creator1,
            name='Плакат "Иван"',
            slug='plakat-ivan',
            description='Плакат с автографом Ивана',
            price=Decimal('19.99'),
            main_image='shop/products/plakat1.png',
            available=True
        )
        # У плакатов нет размеров, но можно оставить одну вариацию без размера
        ProductVariant.objects.create(
            product=prod3,
            size='ONE_SIZE',
            stock=15
        )
        products.append(prod3)

        # Товар 4: Аксессуар — значок
        prod4 = Product.objects.create(
            category=categories[3],
            creator=creator2,
            name='Значок "Анна"',
            slug='znachok-anna',
            description='Металлический значок с логотипом',
            price=Decimal('9.99'),
            main_image='shop/products/znachok1.png',
            available=True
        )
        ProductVariant.objects.create(
            product=prod4,
            size='ONE_SIZE',
            stock=50
        )
        products.append(prod4)

        # 4. Изображения (дополнительные)
        # Для каждого товара можно добавить несколько фото
        # Здесь просто пример для первого товара
        ProductImage.objects.create(
            product=prod1,
            image='shop/products/additional/futbolka_back.png',
            is_main=False
        )

        # 5. Отзывы
        Review.objects.create(
            product=prod1,
            user=user1,
            rating=5,
            comment='Отличная футболка! Качественный принт.'
        )
        Review.objects.create(
            product=prod2,
            user=user2,
            rating=4,
            comment='Худи удобное, но великоват размер.'
        )
        Review.objects.create(
            product=prod1,
            user=user2,
            rating=5,
            comment='Быстрая доставка, товар как на фото.'
        )

        # 6. Избранное и лайки
        Wishlist.objects.create(user=user1, product=prod2)
        Wishlist.objects.create(user=user1, product=prod3)
        Wishlist.objects.create(user=user2, product=prod1)

        Like.objects.create(user=user1, product=prod1)
        Like.objects.create(user=user2, product=prod2)

        self.stdout.write(self.style.SUCCESS('Test data loaded successfully!'))