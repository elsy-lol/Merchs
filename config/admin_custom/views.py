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
        
        context['total_products'] = Product.objects.count()
        context['total_orders'] = Order.objects.count()
        context['total_users'] = User.objects.count()
        context['total_creators'] = Creator.objects.count()
        
        context['orders_pending'] = Order.objects.filter(status='pending').count()
        context['orders_paid'] = Order.objects.filter(status='paid').count()
        context['orders_delivered'] = Order.objects.filter(status='delivered').count()
        
        today = timezone.now().date()
        context['revenue_today'] = Payment.objects.filter(
            status='completed',
            paid_at__date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        context['recent_orders'] = Order.objects.select_related('buyer').order_by('-created_at')[:5]
        context['top_products'] = Product.objects.annotate(
            order_count=Count('orderitem')
        ).order_by('-order_count')[:5]
        
        context['low_stock'] = ProductVariant.objects.filter(stock__lt=5).count()
        
        return context


# ============================================================================
# ИСПОЛНИТЕЛИ (CREATORS)
# ============================================================================

class CreatorsView(AdminRequiredMixin, TemplateView):
    template_name = 'admin_custom/creators.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['creators'] = Creator.objects.annotate(product_count=Count('products')).order_by('-created_at')
        return context

class CreatorAddView(AdminRequiredMixin, View):
    template_name = 'admin_custom/creator_form.html'
    def get(self, request):
        return render(request, self.template_name, {'creator': None})
    def post(self, request):
        Creator.objects.create(
            name=request.POST.get('name'),
            slug=request.POST.get('slug'),
            description=request.POST.get('description', '')
        )
        messages.success(request, 'Исполнитель добавлен!')
        return redirect('custom-admin-creators')

class CreatorEditView(AdminRequiredMixin, View):
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
        messages.success(request, 'Исполнитель обновлён!')
        return redirect('custom-admin-creators')

class CreatorDeleteView(AdminRequiredMixin, View):
    def post(self, request, pk):
        creator = get_object_or_404(Creator, pk=pk)
        creator.delete()
        messages.success(request, 'Исполнитель удалён!')
        return redirect('custom-admin-creators')


# ============================================================================
# ТОВАРЫ (PRODUCTS)
# ============================================================================

class ProductsView(AdminRequiredMixin, TemplateView):
    template_name = 'admin_custom/products.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['products'] = Product.objects.select_related('creator', 'category').annotate(variant_count=Count('variants')).order_by('-created_at')
        return context

class ProductAddView(AdminRequiredMixin, View):
    template_name = 'admin_custom/product_form.html'
    def get(self, request):
        return render(request, self.template_name, {
            'product': None,
            'creators': Creator.objects.all(),
            'categories': Category.objects.all(),
        })
    def post(self, request):
        product = Product.objects.create(
            name=request.POST.get('name'),
            description=request.POST.get('description', ''),
            price=request.POST.get('price'),
            product_type=request.POST.get('product_type', 'official'),
            creator_id=request.POST.get('creator'),
            category_id=request.POST.get('category'),
            status=request.POST.get('status', 'published'),
        )
        messages.success(request, 'Товар добавлен!')
        return redirect('custom-admin-products')

class ProductEditView(AdminRequiredMixin, View):
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
        product.price = request.POST.get('price', product.price)
        product.status = request.POST.get('status', product.status)
        product.save()
        messages.success(request, 'Товар обновлён!')
        return redirect('custom-admin-products')

class ProductDeleteView(AdminRequiredMixin, View):
    def post(self, request, pk):
        Product.objects.filter(pk=pk).delete()
        messages.success(request, 'Товар удалён!')
        return redirect('custom-admin-products')


# ============================================================================
# КАТЕГОРИИ (CATEGORIES)
# ============================================================================

class CategoriesView(AdminRequiredMixin, TemplateView):
    template_name = 'admin_custom/categories.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.annotate(product_count=Count('product')).order_by('name')
        return context

class CategoryAddView(AdminRequiredMixin, View):
    def post(self, request):
        Category.objects.create(name=request.POST.get('name'), slug=request.POST.get('slug'))
        messages.success(request, 'Категория добавлена!')
        return redirect('custom-admin-categories')


# ============================================================================
# ЗАКАЗЫ (ORDERS)
# ============================================================================

class OrdersView(AdminRequiredMixin, TemplateView):
    template_name = 'admin_custom/orders.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['orders'] = Order.objects.select_related('buyer').order_by('-created_at')[:50]
        return context

class OrderDetailView(AdminRequiredMixin, TemplateView):
    template_name = 'admin_custom/order_detail.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['order'] = get_object_or_404(Order, pk=kwargs['pk'])
        context['items'] = OrderItem.objects.filter(order_id=kwargs['pk'])
        return context


# ============================================================================
# ПОЛЬЗОВАТЕЛИ (USERS)
# ============================================================================

class UsersView(AdminRequiredMixin, TemplateView):
    """Список пользователей"""
    template_name = 'admin_custom/users.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['users'] = User.objects.annotate(order_count=Count('orders')).order_by('-date_joined')
        return context

class UserEditView(AdminRequiredMixin, View):
    """Редактирование пользователя"""
    template_name = 'admin_custom/user_form.html'
    
    def get(self, request, pk):
        user_obj = get_object_or_404(User, pk=pk)
        return render(request, self.template_name, {'user_obj': user_obj})
    
    def post(self, request, pk):
        user_obj = get_object_or_404(User, pk=pk)
        
        # Основные данные
        user_obj.username = request.POST.get('username', user_obj.username)
        user_obj.email = request.POST.get('email', user_obj.email)
        user_obj.first_name = request.POST.get('first_name', user_obj.first_name)
        user_obj.last_name = request.POST.get('last_name', user_obj.last_name)
        user_obj.role = request.POST.get('role', user_obj.role)
        
        # Права
        user_obj.is_active = request.POST.get('is_active') == 'on'
        user_obj.is_staff = request.POST.get('is_staff') == 'on'
        user_obj.is_superuser = request.POST.get('is_superuser') == 'on'
        
        # ✅ ИЗМЕНЕНИЕ ПАРОЛЯ
        new_password = request.POST.get('new_password')
        if new_password and len(new_password) >= 6:
            user_obj.set_password(new_password)
            messages.success(request, f'Пароль для {user_obj.username} успешно изменен!')
        elif new_password:
            messages.error(request, 'Пароль слишком короткий (минимум 6 символов)!')
            return render(request, self.template_name, {'user_obj': user_obj})

        user_obj.save()
        messages.success(request, f'Данные пользователя {user_obj.username} обновлены!')
        return redirect('custom-admin-users')

class UserDeleteView(AdminRequiredMixin, View):
    """Удаление пользователя"""
    def post(self, request, pk):
        user_obj = get_object_or_404(User, pk=pk)
        if user_obj == request.user:
            messages.error(request, 'Вы не можете удалить самого себя!')
        else:
            username = user_obj.username
            user_obj.delete()
            messages.success(request, f'Пользователь {username} удален!')
        return redirect('custom-admin-users')


# ============================================================================
# ПЛАТЕЖИ (PAYMENTS)
# ============================================================================

class PaymentsView(AdminRequiredMixin, TemplateView):
    template_name = 'admin_custom/payments.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['payments'] = Payment.objects.select_related('order', 'user').order_by('-created_at')[:50]
        return context