from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                data['user'] = user
            else:
                raise serializers.ValidationError("Неверный email или пароль")
        else:
            raise serializers.ValidationError("Email и пароль обязательны")
        
        return data

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Пароли не совпадают"})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email уже зарегистрирован"})
        
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Имя пользователя уже занято"})
        
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user