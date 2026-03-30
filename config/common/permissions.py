from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Редактирование только владельцу, чтение всем"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(obj, 'owner') and obj.owner == request.user

class IsBuyerOrAdmin(permissions.BasePermission):
    """Только покупатель заказа или админ"""
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return hasattr(obj, 'buyer') and obj.buyer == request.user

class IsStaffOrReadOnly(permissions.BasePermission):
    """Только персонал может писать, остальные читают"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

class IsVerifiedSeller(permissions.BasePermission):
    """Только проверенные продавцы"""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and getattr(request.user, 'is_verified_seller', False)