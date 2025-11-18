# Email Verification - Quick Start

## What's Implemented

✅ **Complete 2-step email verification workflow:**
1. User submits Yale email → System sends verification email with token link
2. User clicks email link → Account marked as verified

## Files Created/Modified

### Backend
- `backend/core/views.py` - Email verification logic with token generation
- `backend/core/urls.py` - Added email-verify-confirm route
- `backend/agora_backend/templates/email_verification_confirmed.html` - Confirmation page
- `backend/agora_backend/settings.py` - Email configuration settings

### Documentation
- `EMAIL_VERIFICATION_SETUP.md` - Comprehensive setup guide
- `.env.example` - Environment variable template

## 5-Minute Setup

### Step 1: Copy environment variables
```bash
cp .env.example .env
```

### Step 2: Configure email (choose one)

**For Development (print to console):**
```bash
# .env already has this set
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

**For Production (Gmail example):**
```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-specific-password
```

### Step 3: Test it
```bash
cd backend
python manage.py runserver
```

Visit: `http://localhost:8000/email-verify/`

## How It Works

1. **User fills form:**
   - Email: `student@yale.edu`
   - Only accepts `@yale.edu` domain

2. **Backend sends email:**
   - Generates 24-hour token
   - Builds verification link: `/email-verify-confirm/{uid}/{token}/`
   - Sends HTML email with button + text link

3. **User clicks link:**
   - Token validated
   - Account marked as verified
   - Success page shown

## Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/email-verify/` | GET/POST | Email submission form |
| `/api/email-verify/` | POST | API endpoint |
| `/email-verify-confirm/<uid>/<token>/` | GET | Confirmation link (from email) |

## API Usage

```bash
curl -X POST http://localhost:8000/api/email-verify/ \
  -H "Content-Type: application/json" \
  -d '{"email": "student@yale.edu"}'
```

Response:
```json
{
  "success": true,
  "message": "Verification email sent! Please check your inbox.",
  "email": "student@yale.edu"
}
```

## Testing

In Django shell:
```python
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> User = get_user_model()
>>> user = User.objects.create_user(username='test', email='test@yale.edu', password='pass')
>>> user.is_verified  # Should be False initially
False
```

## Key Features

✅ **Yale-only registration** - Only accepts @yale.edu emails  
✅ **Token-based verification** - 24-hour expiring tokens  
✅ **HTML email templates** - Professional looking emails  
✅ **Responsive UI** - Works on mobile and desktop  
✅ **Error handling** - Helpful error messages  
✅ **API support** - Programmatic verification  
✅ **CSRF protection** - Secure form submissions  
✅ **Flexible backends** - Console, SMTP, SendGrid, AWS SES, etc.

## Next Steps

1. **Read** `EMAIL_VERIFICATION_SETUP.md` for detailed configuration
2. **Test** with Gmail (see setup guide for app password)
3. **Deploy** to production with HTTPS
4. **Monitor** email delivery in production

## Troubleshooting

**Email not sending?**
- Check `.env` file has EMAIL_BACKEND set correctly
- For Gmail, verify app-specific password (see setup guide)

**Link not working?**
- Verify SITE_URL in `.env` matches your domain
- Token valid for 24 hours only

**More help?**
- See `EMAIL_VERIFICATION_SETUP.md` for comprehensive troubleshooting

## Files Changed Summary

```
backend/core/views.py                          # +200 lines: Email logic
backend/core/urls.py                           # +1 line: New route
backend/agora_backend/settings.py              # +12 lines: Email config
backend/agora_backend/templates/...email_verification_confirmed.html  # NEW
.env.example                                   # NEW
EMAIL_VERIFICATION_SETUP.md                    # NEW (comprehensive guide)
EMAIL_VERIFICATION_QUICK_START.md             # NEW (this file)
```

## Architecture Diagram

```
User submits email at /email-verify/
    ↓
Backend validates @yale.edu
    ↓
Generates token + uid
    ↓
Sends HTML email with verification link
    ↓
User clicks link in email
    ↓
Confirms token at /email-verify-confirm/{uid}/{token}/
    ↓
Account marked is_verified=True
    ↓
Success page shown
```

## Security Details

- **Token Generation:** Django's `default_token_generator`
- **Token Expiration:** 24 hours (Django default)
- **Encoding:** URL-safe base64 for user ID
- **CSRF Protection:** All POST endpoints protected
- **Email Validation:** Regex pattern check + domain check
- **One-time use:** Token invalidated after confirmation

---

**Ready to go!** Start with your `.env` configuration and visit `/email-verify/` to test.
