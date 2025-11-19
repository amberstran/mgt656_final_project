# Email Setup Guide for Agora Registration

Currently, the app uses **console email backend** (emails print to terminal instead of being sent). To actually send emails to users, you need to configure a real SMTP server.

## Option 1: Quick Test with Gmail (Recommended for Development)

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Enable 2-Factor Authentication if not already enabled
3. Go to Security → 2-Step Verification → App passwords
4. Generate an app password for "Mail" / "Other (Custom name)"
5. Copy the 16-character password (no spaces)

### Step 2: Update `.env` File

Edit `/Users/liyiru/mgt656_final_project/.env`:

```properties
# Change EMAIL_BACKEND from console to smtp
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend

# Use your Gmail credentials
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your.email@gmail.com
EMAIL_HOST_PASSWORD=your-16-char-app-password
DEFAULT_FROM_EMAIL=your.email@gmail.com
```

### Step 3: Restart Server

```bash
cd backend
python manage.py runserver 8000
```

Now when users register, they'll receive actual emails!

---

## Option 2: Use Yale Email (Production - Requires IT Setup)

Contact Yale IT to get SMTP credentials for `@yale.edu` email sending.

Typical Yale SMTP settings:
```properties
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.yale.edu
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your.netid@yale.edu
EMAIL_HOST_PASSWORD=your-yale-password-or-app-password
DEFAULT_FROM_EMAIL=noreply@agora.yale.edu
```

---

## Option 3: Development - Check Terminal for Links

If you want to keep testing without sending real emails:

1. Keep `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend`
2. After user registers, **look at the terminal running the Django server**
3. You'll see the verification link printed there
4. Copy the link and paste it in your browser

Example terminal output:
```
Content-Type: text/plain; charset="utf-8"
...
Please click the link below to verify your email and set your password:

http://localhost:8000/verify/MQ/c123abc-def456/

This link will expire in 24 hours.
```

---

## Testing the Email Flow

1. Register a new user at `/register/`
2. Check your email inbox (or terminal if using console backend)
3. Click the verification link
4. Set your password
5. You'll be automatically logged in and redirected to `/profile/`

---

## Troubleshooting

### "SMTPAuthenticationError"
- Wrong email/password
- Need to use app-specific password for Gmail
- 2FA must be enabled for Gmail

### "SMTPServerDisconnected" 
- Wrong host or port
- Check firewall/network settings

### Still printing to console instead of sending
- Make sure you edited the `.env` file
- Restart the Django server after changing `.env`
- Check `EMAIL_BACKEND` is set to `smtp.EmailBackend`

---

## Security Notes

⚠️ **Never commit `.env` file to git** - it contains sensitive passwords!

The `.gitignore` should already exclude it. Verify with:
```bash
git status
# .env should NOT appear in untracked files
```
