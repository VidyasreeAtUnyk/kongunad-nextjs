# Form Submission System Setup Guide

This guide will help you set up the form submission system with Supabase, Resend, and the admin dashboard.

## Prerequisites

- Node.js installed
- A Supabase account (free tier available)
- A Resend account (free tier available)

## Step 1: Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a free account
2. Create a new project
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy and paste the contents of `supabase/schema.sql` into the SQL Editor
5. Click **Run** to create the table and indexes
6. Go to **Settings** → **API** to get your credentials:
   - Copy the **Project URL** (this is `NEXT_PUBLIC_SUPABASE_URL`)
   - Copy the **service_role** key (this is `SUPABASE_SERVICE_ROLE_KEY` - keep this secret!)

## Step 2: Set Up Resend

1. Go to [Resend](https://resend.com) and create a free account
2. Go to **API Keys** and create a new API key
3. Copy the API key (this is `RESEND_API_KEY`)
4. For the free tier, you can use `onboarding@resend.dev` as the FROM email
5. Set `RESEND_TO_EMAIL` to the email address where you want to receive form submissions

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   RESEND_API_KEY=re_your_api_key
   RESEND_FROM_EMAIL=onboarding@resend.dev
   RESEND_TO_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD=your_secure_password
   ```

## Step 4: Install Dependencies

Dependencies are already installed, but if you need to reinstall:
```bash
npm install
```

## Step 5: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test form submission:
   - Go to any form page (appointment, checkup, research, job)
   - Fill out and submit a form
   - Check your email for the notification
   - Check Supabase dashboard to see the submission

3. Test admin dashboard:
   - Go to `/admin/login`
   - Enter your `ADMIN_PASSWORD`
   - You should see the submissions dashboard

## Step 6: Access Admin Dashboard

1. Navigate to `/admin/login` in your browser
2. Enter the password you set in `ADMIN_PASSWORD`
3. You'll be redirected to `/admin` where you can:
   - View all form submissions
   - Filter by form type and status
   - Search submissions
   - Update submission status
   - Export to CSV
   - View detailed submission information

## Troubleshooting

### Forms not submitting?
- Check browser console for errors
- Verify API route is working: `/api/forms/submit`
- Check Supabase credentials are correct
- Ensure table was created successfully

### Emails not sending?
- Verify Resend API key is correct
- Check Resend dashboard for email logs
- For free tier, FROM email must be `onboarding@resend.dev`
- Check spam folder

### Admin dashboard not accessible?
- Verify `ADMIN_PASSWORD` is set in `.env.local`
- Clear browser cookies and try again
- Check browser console for errors

### Database errors?
- Verify Supabase URL and service role key
- Check that the table was created (go to Table Editor in Supabase)
- Ensure RLS policies are set correctly

## Production Deployment

1. Add all environment variables to your hosting platform (Vercel, Netlify, etc.)
2. Update `RESEND_FROM_EMAIL` to your verified domain email
3. Set a strong `ADMIN_PASSWORD`
4. Consider adding rate limiting to the API routes
5. Enable HTTPS for secure cookie transmission

## Security Notes

- Never commit `.env.local` to version control
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (it bypasses RLS)
- Use a strong `ADMIN_PASSWORD`
- Consider implementing rate limiting in production
- For production, use a verified domain email for Resend

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check server logs
3. Verify all environment variables are set correctly
4. Check Supabase and Resend dashboards for service status

