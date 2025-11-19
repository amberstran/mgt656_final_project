# Email Verification Setup Guide

## Overview

The Agora application implements a 2-step email verification process for Yale-only registration:

1. **User submits Yale email** → System sends verification email with token link
2. **User clicks link in email** → Account is marked as verified

## Architecture

### Views

- **`email_verification_view()`** - Form submission endpoint that sends verification emails
- **`email_verification_confirm_view()`** - Token validation endpoint (accessed via email link)
- **`email_verification_api_view()`** - API version for programmatic email verification

### Templates

- **`email_verification.html`** - Email submission form
- **`email_verification_confirmed.html`** - Success/failure confirmation page after clicking email link

### Security

- Uses Django's `default_token_generator` for token generation
- Tokens are one-time use and expire after 24 hours
- URL-safe base64 encoding for user ID
- CSRF protection on form submissions

## Configuration

### 1. Environment Variables

Create a `.env` file in the project root with your email settings:

```bash
# For Development (prints emails to console)
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
SITE_URL=http://localhost:8000

# For Production with Gmail
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
DEFAULT_FROM_EMAIL=noreply@agora.yale.edu
SITE_URL=https://agora.yale.edu
```

### 2. Email Backend Options

#### Development (Console Backend)
```
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```
- Prints emails to Django console/logs
- No actual email sending
- Perfect for testing

#### Production (SMTP Backend)
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
```

**For Gmail:**
1. Enable 2-factor authentication on your Google account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app-specific password
4. Use this password in `EMAIL_HOST_PASSWORD`

#### Alternative Providers

**SendGrid:**
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
```

**AWS SES:**
```
EMAIL_BACKEND=django_ses.SESBackend
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_SES_REGION_NAME=us-east-1
AWS_SES_REGION_ENDPOINT=email.us-east-1.amazonaws.com
```

### 3. Django Settings

The following are automatically configured in `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # Default
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
DEFAULT_FROM_EMAIL = 'noreply@agora.yale.edu'
SITE_URL = 'http://localhost:8000'
```

## Usage

### For Users

1. **Access the verification page:**
   ```
   http://localhost:8000/email-verify/
   ```

2. **Submit Yale email:**
   - Enter email address ending with `@yale.edu`
   - Click "Send Verification Email"

3. **Confirm in email:**
   - Check email inbox (check spam folder if not found)
   - Click "Verify Email" button in the email
   - This redirects to success confirmation page

4. **Account is now verified!**

### For Developers

**Test email sending in console:**
```bash
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> from django.core.mail import send_mail
>>> User = get_user_model()
>>> user = User.objects.get(username='testuser')
>>> send_mail('Test', 'This is a test', 'noreply@agora.yale.edu', [user.email])
```

**Check token validity:**
```python
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

# Generate token for user
token = default_token_generator.make_token(user)
uid = urlsafe_base64_encode(force_bytes(user.pk))

# Validate token
is_valid = default_token_generator.check_token(user, token)
```

## Testing

### Test Flow

1. **Create test user:**
   ```bash
   python manage.py shell
   >>> from django.contrib.auth import get_user_model
   >>> User = get_user_model()
   >>> user = User.objects.create_user(username='testuser', email='testuser@yale.edu', password='testpass123')
   ```

2. **Set EMAIL_BACKEND to console:**
   ```python
   EMAIL_BACKEND='django.core.mail.backends.console.EmailBackend'
   ```

3. **Submit form at `/email-verify/`:**
   - Check console output for verification email
   - Copy the verification link
   - Visit the link in browser
   - Should see success confirmation page

4. **Verify user is marked as verified:**
   ```python
   >>> user.refresh_from_db()
   >>> user.is_verified
   True
   ```

### Email Content

The verification email includes:
- Personalized greeting with username
- Clear call-to-action button
- Fallback text link
- Expiration notice (24 hours)
- HTML and plain text versions

## API Endpoints

### POST /api/email-verify/
Send verification email via API

**Request:**
```json
{
  "email": "user@yale.edu"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox.",
  "email": "user@yale.edu",
  "verified": false
}
```

**Response (Error):**
```json
{
  "error": "Please use your Yale email address (@yale.edu)"
}
```

### GET /email-verify-confirm/<uidb64>/<token>/
Confirm email via token (accessed from email link)

**Success Response:**
- Redirects to confirmation page with success message
- Sets `is_verified=True` on user

**Failure Response:**
- Shows error message on confirmation page
- Offers link to request new verification

## Troubleshooting

### Email Not Sending

1. **Check EMAIL_BACKEND setting:**
   ```python
   # Development
   EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
   
   # Production
   EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
   ```

2. **Verify SMTP credentials:**
   ```bash
   python manage.py shell
   >>> import smtplib
   >>> smtp = smtplib.SMTP('smtp.gmail.com', 587)
   >>> smtp.starttls()
   >>> smtp.login('your-email@gmail.com', 'your-password')
   ```

3. **Check Django logs:**
   ```bash
   tail -f logs/django.log
   ```

### Email Received but Link Doesn't Work

1. **Verify SITE_URL is correct:**
   ```python
   SITE_URL = 'http://localhost:8000'  # Local development
   SITE_URL = 'https://agora.yale.edu'  # Production
   ```

2. **Check token hasn't expired (24 hours max)**

3. **Verify email link format:**
   ```
   {SITE_URL}/email-verify-confirm/{uid}/{token}/
   ```

### User Email Not Updating

1. **Verify CustomUser model has email field:**
   ```bash
   python manage.py shell
   >>> from django.contrib.auth import get_user_model
   >>> User = get_user_model()
   >>> user = User.objects.get(username='testuser')
   >>> user.email = 'newemail@yale.edu'
   >>> user.save()
   ```

2. **Check is_verified field exists:**
   ```python
   >>> hasattr(user, 'is_verified')
   True
   ```

## Frontend Integration

### Using with React Component

```javascript
async function verifyEmail(email) {
  const response = await fetch('/api/email-verify/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken'),
    },
    body: JSON.stringify({ email }),
  });
  
  const data = await response.json();
  if (data.success) {
    alert('Check your email for verification link!');
  } else {
    alert(data.error);
  }
}
```

### Using with Django Form

```html
<form method="post" action="{% url 'email_verification' %}">
  {% csrf_token %}
  <input type="email" name="email" placeholder="user@yale.edu" required>
  <button type="submit">Verify Email</button>
</form>
```

## Security Considerations

1. **Token Expiration:** Tokens expire after 24 hours for security
2. **One-Time Use:** Tokens are invalidated after successful use
3. **CSRF Protection:** All form submissions include CSRF tokens
4. **Email Validation:** Only accepts Yale emails (@yale.edu domain)
5. **Secure Links:** Uses HTTPS in production (SITE_URL must be https://)

## Production Checklist

- [ ] Set `DEBUG = False` in settings
- [ ] Use `EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'`
- [ ] Configure SMTP credentials (Gmail, SendGrid, AWS SES, etc.)
- [ ] Set `SITE_URL` to your production domain (https://)
- [ ] Set secure `SECRET_KEY` in environment
- [ ] Enable HTTPS
- [ ] Configure proper email sender address
- [ ] Test email sending before going live
- [ ] Set up email error logging and monitoring
- [ ] Configure SPF/DKIM records for your domain

## Resources

- [Django Email Documentation](https://docs.djangoproject.com/en/5.2/topics/email/)
- [Django Tokens Documentation](https://docs.djangoproject.com/en/5.2/topics/auth/passwords/#using-the-token-generator)
- [Django Email Backends](https://docs.djangoproject.com/en/5.2/topics/email/#email-backends)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
