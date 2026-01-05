# Cloudflare Turnstile CAPTCHA Setup

## Configuration Steps

1. **Get Cloudflare Turnstile Keys:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Turnstile** → **Add Site**
   - Enter your domain name
   - Choose widget mode (recommended: **Managed** for invisible CAPTCHA)
   - Copy your **Site Key** and **Secret Key**

2. **Add Keys to Environment:**
   Add these lines to your `.env` file:
   ```
   TURNSTILE_SITE_KEY=your_site_key_here
   TURNSTILE_SECRET_KEY=your_secret_key_here
   TURNSTILE_THEME=light
   TURNSTILE_SIZE=normal
   TURNSTILE_LANGUAGE=auto
   ```

3. **Clear Config Cache:**
   ```bash
   php artisan config:clear
   ```

## How It Works

- The CAPTCHA widget appears on the checkout form
- Users complete the CAPTCHA before submitting orders
- The token is validated on the backend before processing the order
- If CAPTCHA fails, the order is rejected with a user-friendly error message

## Testing

- If Turnstile keys are not configured, the form will work without CAPTCHA (graceful degradation)
- Once keys are added, CAPTCHA will be required for all order submissions
- Test with invalid tokens to ensure validation works correctly

## Troubleshooting

### Common Issues

- **CAPTCHA not showing:** 
  - Check that Site Key is correctly set in `.env`
  - Clear config cache: `php artisan config:clear`
  - Verify the Site Key is active in Cloudflare dashboard

- **Error 110200 (TurnstileError):**
  - This usually means the Site Key doesn't match your domain
  - Go to Cloudflare Dashboard → Turnstile → Your Site
  - Verify the domain matches exactly (including www/non-www, http/https)
  - Make sure you're using the correct Site Key for your domain
  - If testing locally, use `localhost` or `127.0.0.1` in Cloudflare settings, or use a test Site Key

- **400 Bad Request errors:**
  - Usually indicates domain mismatch or invalid Site Key
  - Check browser console for specific error codes
  - Verify your domain is added correctly in Cloudflare Turnstile settings

- **Validation failing:** 
  - Verify Secret Key is correct and check server logs
  - Ensure Secret Key matches the Site Key in Cloudflare dashboard
  - Check that the token is being sent correctly (check Network tab in browser)

- **Network errors:** 
  - Ensure server can reach `challenges.cloudflare.com`
  - Check firewall settings
  - Verify DNS resolution

- **Script loading issues:**
  - Clear browser cache
  - Check browser console for JavaScript errors
  - Ensure no ad blockers are interfering
  - Try disabling browser extensions temporarily

### Testing Without Turnstile

If you want to test the form without CAPTCHA:
- Remove or comment out the `TURNSTILE_SITE_KEY` in `.env`
- The form will work without CAPTCHA validation (graceful degradation)
