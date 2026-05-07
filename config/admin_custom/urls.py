# config/admin_custom/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.AdminLoginView.as_view(), name='custom-admin-login'),
    path('logout/', views.AdminLogoutView.as_view(), name='custom-admin-logout'),
    path('', views.DashboardView.as_view(), name='custom-admin-dashboard'),
    
    # Исполнители
    path('creators/', views.CreatorsView.as_view(), name='custom-admin-creators'),
    path('creators/add/', views.CreatorAddView.as_view(), name='custom-admin-creator-add'),
    path('creators/edit/<int:pk>/', views.CreatorEditView.as_view(), name='custom-admin-creator-edit'),
    path('creators/delete/<int:pk>/', views.CreatorDeleteView.as_view(), name='custom-admin-creator-delete'),
    
    # Товары
    path('products/', views.ProductsView.as_view(), name='custom-admin-products'),
    path('products/add/', views.ProductAddView.as_view(), name='custom-admin-product-add'),
    path('products/edit/<int:pk>/', views.ProductEditView.as_view(), name='custom-admin-product-edit'),
    path('products/delete/<int:pk>/', views.ProductDeleteView.as_view(), name='custom-admin-product-delete'),
    
    # Категории
    path('categories/', views.CategoriesView.as_view(), name='custom-admin-categories'),
    path('categories/add/', views.CategoryAddView.as_view(), name='custom-admin-category-add'),
    
    # Заказы
    path('orders/', views.OrdersView.as_view(), name='custom-admin-orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='custom-admin-order-detail'),
    
    # Пользователи
    path('users/', views.UsersView.as_view(), name='custom-admin-users'),
    path('users/edit/<int:pk>/', views.UserEditView.as_view(), name='custom-admin-user-edit'),
    path('users/delete/<int:pk>/', views.UserDeleteView.as_view(), name='custom-admin-user-delete'),
    
    # Платежи
    path('payments/', views.PaymentsView.as_view(), name='custom-admin-payments'),
]