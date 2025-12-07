# Google Analytics Setup Guide

## Prerequisites

1. A Google Analytics 4 (GA4) account
2. A GA4 property created for your website
3. A Measurement ID (format: `G-XXXXXXXXXX`)

## Setup Steps

### 1. Create Google Analytics Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property (if you don't have one)
3. Set up a data stream for your website
4. Copy your Measurement ID (starts with `G-`)

### 2. Add Environment Variable

Add the following to your `.env.local` file:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Verify Installation

1. Deploy your site or run it locally
2. Visit your website
3. Open Google Analytics Real-Time reports
4. You should see your visit appear within a few seconds

## Features

- **Automatic Page View Tracking**: Page views are automatically tracked when users navigate between pages
- **Client-Side Only**: Analytics only loads on the client side to avoid server-side overhead
- **Performance Optimized**: Scripts load with `afterInteractive` strategy for optimal performance

## Event Tracking (Future Enhancement)

To track custom events, you can use the `gtag` function:

```typescript
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'event_name', {
    event_category: 'category',
    event_label: 'label',
    value: 0
  })
}
```

## Privacy & Compliance

- Ensure your privacy policy mentions Google Analytics usage
- Consider implementing cookie consent if required by your jurisdiction
- Google Analytics respects Do Not Track settings

## Troubleshooting

### Analytics not working?

1. Check that `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set correctly
2. Verify the Measurement ID format (should start with `G-`)
3. Check browser console for any errors
4. Use Google Analytics DebugView to verify events are being sent
5. Ensure ad blockers aren't blocking the analytics script

### Testing Locally

- Analytics works in development mode
- Use Google Analytics Real-Time reports to verify
- Note: Some ad blockers may prevent analytics from loading

