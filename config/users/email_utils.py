# config/users/email_utils.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def send_2fa_email(target_email, code):
    """
    Отправка письма с кодом 2FA через smtplib.
    Чистая реализация для продакшена без вывода в консоль.
    """
    logger.info(f"📧 Отправка 2FA кода на {target_email}...")

    try:
        # Проверка наличия настроек (если их нет, это ошибка конфигурации)
        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            logger.error("❌ ОШИБКА: SMTP учетные данные не настроены в settings.py")
            return False

        smtp_server = settings.EMAIL_HOST
        smtp_port = settings.EMAIL_PORT
        smtp_user = settings.EMAIL_HOST_USER
        smtp_password = settings.EMAIL_HOST_PASSWORD
        use_tls = settings.EMAIL_USE_TLS

        # Создание сообщения
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "🔐 Код подтверждения | Merch Market"
        msg['From'] = f"Merch Market <{smtp_user}>"
        msg['To'] = target_email

        html = f"""
        <html>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica', Arial, sans-serif; background-color: #000; color: #fff;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #333;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="font-size: 32px; font-weight: 900; color: #ff3e3e; margin: 0; text-transform: uppercase;">
                        MERCH MARKET
                    </h1>
                </div>
                
                <div style="background: #111; padding: 30px; border-radius: 4px; text-align: center;">
                    <p style="font-size: 16px; color: #ccc; margin-bottom: 20px;">Ваш одноразовый код безопасности:</p>
                    <div style="font-size: 48px; font-weight: 900; letter-spacing: 8px; color: #fff; margin: 20px 0; border: 2px dashed #333; padding: 20px;">
                        {code}
                    </div>
                    <p style="font-size: 14px; color: #666;">Никому не сообщайте этот код. Если вы не запрашивали его, просто проигнорируйте письмо.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html, 'html'))

        # Подключение и отправка
        server = smtplib.SMTP(smtp_server, smtp_port, timeout=10)
        if use_tls:
            server.starttls()
        
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, target_email, msg.as_string())
        server.quit()
        
        logger.info(f"✅ Код успешно отправлен на {target_email}")
        return True
        
    except Exception as e:
        logger.error(f"❌ Ошибка при отправке через smtplib: {str(e)}")
        return False
