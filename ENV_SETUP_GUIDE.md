# Environment Variables Setup Guide

## Step 1: Get Supabase Credentials

### 1.1 Go to Supabase Dashboard
1. Visit [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Create a new project (or select existing one)
   - Choose a name for your project
   - Set a database password (save this!)
   - Select a region closest to you
   - Wait for project to be created (~2 minutes)

### 1.2 Get API Credentials
1. In your Supabase project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:

   **a) Project URL:**
   - Look for "Project URL" section
   - It looks like: `https://xxxxxxxxxxxxx.supabase.co`
   - Copy this entire URL
   - This is your `NEXT_PUBLIC_SUPABASE_URL`

   **b) Service Role Key:**
   - Scroll down to "Project API keys" section
   - Find the **`service_role`** key (NOT the `anon` key!)
   - Click the eye icon to reveal it
   - Copy the entire key (it's very long, starts with `eyJ...`)
   - ⚠️ **IMPORTANT**: This key has admin access - keep it secret!
   - This is your `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Verify Table Was Created
1. In Supabase dashboard, go to **Table Editor** (left sidebar)
2. You should see `form_submissions` table
3. If not, go to **SQL Editor** and run the schema.sql file again

---

## Step 2: Get Resend Credentials

### 2.1 Create Resend Account
1. Visit [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email

### 2.2 Get API Key
1. After logging in, go to **API Keys** in the left sidebar
2. Click **Create API Key**
3. Give it a name (e.g., "Kongunad Hospital Forms")
4. Copy the API key (starts with `re_...`)
   - ⚠️ You can only see it once - copy it immediately!
   - This is your `RESEND_API_KEY`

### 2.3 Set Email Addresses
- **FROM Email**: For free tier, use `onboarding@resend.dev`
  - Or verify your own domain (requires domain setup)
- **TO Email**: The email where you want to receive form submissions
  - Example: `admin@kongunadhospital.com` or your personal email

---

## Step 3: Set Up .env.local File

### 3.1 Create/Edit .env.local
1. In your project root, create or edit `.env.local` file
2. Add the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdC1pZCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDU3ODk2MDAsImV4cCI6MTk2MTM2NTYwMH0.your-actual-key-here

# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=admin@yourdomain.com

# Admin Dashboard Password
ADMIN_PASSWORD=your_secure_password_here
```

### 3.2 Replace Placeholder Values

**Replace these with your actual values:**

1. `NEXT_PUBLIC_SUPABASE_URL`
   - Replace `https://your-project-id.supabase.co` with your actual Supabase Project URL

2. `SUPABASE_SERVICE_ROLE_KEY`
   - Replace `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` with your actual service_role key from Supabase

3. `RESEND_API_KEY`
   - Replace `re_your_actual_api_key_here` with your actual Resend API key

4. `RESEND_FROM_EMAIL`
   - For free tier: Keep as `onboarding@resend.dev`
   - For production: Use your verified domain email

5. `RESEND_TO_EMAIL`
   - Replace with the email where you want to receive form submissions

6. `ADMIN_PASSWORD`
   - Set a strong password for accessing `/admin` dashboard
   - Example: `MySecureP@ssw0rd2024!`

---

## Step 4: Verify Setup

### 4.1 Check File Location
Make sure `.env.local` is in your project root:
```
kongunad-nextjs/
  ├── .env.local          ← Should be here
  ├── package.json
  ├── src/
  └── ...
```

### 4.2 Restart Development Server
After creating/editing `.env.local`:
```bash
# Stop your dev server (Ctrl+C)
# Then restart it
npm run dev
```

### 4.3 Test the Setup

1. **Test Form Submission:**
   - Go to `/book-appointment` or any form page
   - Fill out and submit a form
   - Check browser console for errors

2. **Check Supabase:**
   - Go to Supabase Table Editor
   - You should see a new row in `form_submissions` table

3. **Check Email:**
   - Check your `RESEND_TO_EMAIL` inbox
   - You should receive an email notification

4. **Test Admin Dashboard:**
   - Go to `/admin/login`
   - Enter your `ADMIN_PASSWORD`
   - You should see the dashboard with your test submission

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"
- **Solution**: Make sure `.env.local` exists and has correct variable names
- Check for typos: `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
- Restart your dev server after editing `.env.local`

### Issue: "Failed to save submission"
- **Solution**: 
  - Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (service_role, not anon)
  - Check that table `form_submissions` exists in Supabase
  - Check Supabase project is active (not paused)

### Issue: "Email not sending"
- **Solution**:
  - Verify `RESEND_API_KEY` is correct
  - Check Resend dashboard for email logs
  - For free tier, FROM email must be `onboarding@resend.dev`
  - Check spam folder

### Issue: "Unauthorized" in admin dashboard
- **Solution**:
  - Verify `ADMIN_PASSWORD` is set in `.env.local`
  - Make sure you're using the correct password
  - Clear browser cookies and try again

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret - it has admin access
- Use a strong `ADMIN_PASSWORD`
- In production, set these as environment variables in your hosting platform

---

## Quick Reference

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | `https://abc123.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key | `eyJhbGciOiJIUzI1NiIs...` |
| `RESEND_API_KEY` | Resend → API Keys → Create Key | `re_abc123...` |
| `RESEND_FROM_EMAIL` | Use `onboarding@resend.dev` (free tier) | `onboarding@resend.dev` |
| `RESEND_TO_EMAIL` | Your email address | `admin@yourdomain.com` |
| `ADMIN_PASSWORD` | Set your own password | `MySecureP@ss123!` |

---

## Next Steps

Once `.env.local` is set up:
1. ✅ Restart your dev server
2. ✅ Test a form submission
3. ✅ Check Supabase for the submission
4. ✅ Check email for notification
5. ✅ Access admin dashboard at `/admin/login`

You're all set! 🎉

