# config/admin_custom/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView, View
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta

from shop.models import Creator, Category, Product, ProductVariant
from orders.models import Order, OrderItem
from payments.models import Payment
from django.contrib.auth import get_user_model

User = get_user_model()


# ============================================================================
# АУТЕНТИФИКАЦИЯ
# ============================================================================

class AdminLoginView(View):
    """Страница входа в админку"""
    template_name = 'admin_custom/login.html'
    
    def get(self, request):
        if request.user.is_authenticated and request.user.is_superuser:
            return redirect('custom-admin-dashboard')
        return render(request, self.template_name)
    
    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user and user.is_superuser:
            login(request, user)
            return redirect('custom-admin-dashboard')
        else:
            return render(request, self.template_name, {
                'error': 'Неверное имя пользователя или пароль. Только для суперюзеров!'
            })


class AdminLogoutView(View):
    """Выход из админки"""
    def get(self, request):
        logout(request)
        return redirect('custom-admin-login')


# ============================================================================
# БАЗОВЫЙ КЛАСС ДЛЯ ПРОВЕРКИ ПРАВ
# ============================================================================

class AdminRequiredMixin(View):
    """Миксин для проверки прав суперюзера"""
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_superuser:
            return redirect('custom-admin-login')
        return super().dispatch(request, *args, **kwargs)


# ============================================================================
# ДАШБОРД
# ============================================================================

class DashboardView(AdminRequiredMixin, TemplateView):
    """Главная панель администратора"""
    template_name = 'admin_custom/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Основная статистика
        context['total_products'] = Product.objects.count()
        context['total_orders'] = Order.objects.count()
        context['total_users'] = User.objects.count()
        context['total_creators'] = Creator.objects.count()
        
        # Заказы по статусам
        context['orders_pending'] = Order.objects.filter(status='pending').count()
        context['orders_paid'] = Order.objects.filter(status='paid').count()
        context['orders_delivered'] = Order.objects.filter(status='delivered').count()
        
        # Доход за сегодня
        today = timezone.now().date()
        context['revenue_today'] = Payment.objects.filter(
            status='completed',
            paid_at__date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Доход за неделю
        week_ago = today - timedelta(days=7)
        context['revenue_week'] = Payment.objects.filter(
            status='completed',
            paid_at__date__gte=week_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Доход за месяц
        month_ago = today - timedelta(days=30)
        context['revenue_month'] = Payment.objects.filter(
            status='completed',
            paid_at__date__gte=month_ago
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Последние заказы
        context['recent_orders'] = Order.objects.select_related('buyer').order_by('-created_at')[:5]
        
        # ✅ ИСПРАВЛЕНО: order_items → orderitem
        context['top_products'] = Product.objects.annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:5]
        
        # Товары с низким запасом
        context['low_stock'] = ProductVariant.objects.filter(stock__lt=5).count()
        
        return context


# ============================================================================
# ИСПОЛНИТЕЛИ (CREATORS)
# ============================================================================

class CreatorsView(AdminRequiredMixin, TemplateView):
    """Список исполнителей"""
    template_name = 'admin_custom/creators.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # ✅ ИСПРАВЛЕНО: products → product
        context['creators'] = Creator.objects.annotate(
            product_count=Count('product')
        ).order_by('-created_at')
        return context


class CreatorAddView(AdminRequiredMixin, View):
    """Добавление исполнителя"""
    template_name = 'admin_custom/creator_form.html'
    
    def get(self, request):
        return render(request, self.template_name, {'creator': None})
    
    def post(self, request):
        name = request.POST.get('name')
        slug = request.POST.get('slug')
        description = request.POST.get('description', '')
        
        if not name or not slug:
            messages.error(request, 'Имя и slug обязательны')
            return redirect('custom-admin-creator-add')
        
        Creator.objects.create(
            name=name,
            slug=slug,
            description=description
        )
        messages.success(request, f'Исполнитель "{name}" добавлен!')
        return redirect('custom-admin-creators')


class CreatorEditView(AdminRequiredMixin, View):
    """Редактирование исполнителя"""
    template_name = 'admin_custom/creator_form.html'
    
    def get(self, request, pk):
        creator = get_object_or_404(Creator, pk=pk)
        return render(request, self.template_name, {'creator': creator})
    
    def post(self, request, pk):
        creator = get_object_or_404(Creator, pk=pk)
        creator.name = request.POST.get('name', creator.name)
        creator.slug = request.POST.get('slug', creator.slug)
        creator.description = request.POST.get('description', creator.description)
        creator.save()
        messages.success(request, f'Исполнитель "{creator.name}" обновлён!')
        return redirect('custom-admin-creators')


class CreatorDeleteView(AdminRequiredMixin, View):
    """Удаление исполнителя"""
    def post(self, request, pk):
        creator = get_object_or_404(Creator, pk=pk)
        name = creator.name
        creator.delete()
        messages.success(request, f'Исполнитель "{name}" удалён!')
        return redirect('custom-admin-creators')


# ============================================================================
# ТОВАРЫ (PRODUCTS)
# ============================================================================

class ProductsView(AdminRequiredMixin, TemplateView):
    """Список товаров"""
    template_name = 'admin_custom/products.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.select_related(
            'creator', 'category'
        ).annotate(
            variant_count=Count('variants')
        ).order_by('-created_at')
        return context


class ProductAddView(AdminRequiredMixin, View):
    """Добавление товара"""
    template_name = 'admin_custom/product_form.html'
    
    def get(self, request):
        return render(request, self.template_name, {
            'product': None,
            'creators': Creator.objects.all(),
            'categories': Category.objects.all(),
        })
    
    def post(self, request):
        try:
            product = Product.objects.create(
                name=request.POST.get('name'),
                description=request.POST.get('description', ''),
                price=request.POST.get('price'),
                product_type=request.POST.get('product_type', 'official'),
                creator_id=request.POST.get('creator'),
                category_id=request.POST.get('category'),
                status=request.POST.get('status', 'published'),
            )
            
            # Создаём варианты (только при создании)
            sizes = request.POST.getlist('sizes')
            stock = int(request.POST.get('stock', 10))
            for size in sizes:
                ProductVariant.objects.create(
                    product=product,
                    size=size,
                    stock=stock
                )
            
            messages.success(request, f'Товар "{product.name}" добавлен!')
            return redirect('custom-admin-products')
        except Exception as e:
            messages.error(request, f'Ошибка: {str(e)}')
            return redirect('custom-admin-product-add')


class ProductEditView(AdminRequiredMixin, View):
    """Редактирование товара"""
    template_name = 'admin_custom/product_form.html'
    
    def get(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        return render(request, self.template_name, {
            'product': product,
            'creators': Creator.objects.all(),
            'categories': Category.objects.all(),
        })
    
    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        product.name = request.POST.get('name', product.name)
        product.description = request.POST.get('description', product.description)
        product.price = request.POST.get('price', product.price)
        product.product_type = request.POST.get('product_type', product.product_type)
        product.creator_id = request.POST.get('creator', product.creator_id)
        product.category_id = request.POST.get('category', product.category_id)
        product.status = request.POST.get('status', product.status)
        product.save()
        messages.success(request, f'Товар "{product.name}" обновлён!')
        return redirect('custom-admin-products')


class ProductDeleteView(AdminRequiredMixin, View):
    """Удаление товара"""
    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        name = product.name
        product.delete()
        messages.success(request, f'Товар "{name}" удалён!')
        return redirect('custom-admin-products')


# ============================================================================
# КАТЕГОРИИ (CATEGORIES)
# ============================================================================

class CategoriesView(AdminRequiredMixin, TemplateView):
    """Список категорий"""
    template_name = 'admin_custom/categories.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # ✅ ИСПРАВЛЕНО: products → product
        context['categories'] = Category.objects.annotate(
            product_count=Count('product')
        ).order_by('name')
        return context


class CategoryAddView(AdminRequiredMixin, View):
    """Добавление категории"""
    def post(self, request):
        name = request.POST.get('name')
        slug = request.POST.get('slug')
        
        if not name or not slug:
            messages.error(request, 'Имя и slug обязательны')
            return redirect('custom-admin-categories')
        
        Category.objects.create(name=name, slug=slug)
        messages.success(request, f'Категория "{name}" добавлена!')
        return redirect('custom-admin-categories')


# ============================================================================
# ЗАКАЗЫ (ORDERS)
# ============================================================================

class OrdersView(AdminRequiredMixin, TemplateView):
    """Список заказов"""
    template_name = 'admin_custom/orders.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['orders'] = Order.objects.select_related('buyer').order_by('-created_at')[:50]
        return context


class OrderDetailView(AdminRequiredMixin, TemplateView):
    """Детали заказа"""
    template_name = 'admin_custom/order_detail.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['order'] = get_object_or_404(Order, pk=kwargs['pk'])
        context['items'] = OrderItem.objects.filter(order_id=kwargs['pk'])
        context['payments'] = Payment.objects.filter(order_id=kwargs['pk'])
        return context


# ============================================================================
# ПОЛЬЗОВАТЕЛИ (USERS)
# ============================================================================

class UsersView(AdminRequiredMixin, TemplateView):
    """Список пользователей"""
    template_name = 'admin_custom/users.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['users'] = User.objects.annotate(
            order_count=Count('orders')
        ).order_by('-date_joined')
        return context


# ============================================================================
# ПЛАТЕЖИ (PAYMENTS)
# ============================================================================

class PaymentsView(AdminRequiredMixin, TemplateView):
    """Список платежей"""
    template_name = 'admin_custom/payments.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['payments'] = Payment.objects.select_related(
            'order', 'user'
        ).order_by('-created_at')[:50]
        return context