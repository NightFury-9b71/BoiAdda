# Deployment Guide

## Production Deployment Options

### 1. Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_API_BASE_URL=https://your-api-domain.com`
3. Deploy automatically on push to main branch

### 2. Netlify

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables in Netlify dashboard

### 3. Traditional Hosting

1. Run `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the index.html for all routes

## Environment Variables for Production

```
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_NAME=বই আড্ডা
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

## Pre-deployment Checklist

- [ ] Run `npm run build` and verify no errors
- [ ] Test the built application with `npm run preview`
- [ ] Update API base URL for production
- [ ] Set up proper CORS on backend
- [ ] Test all major features
- [ ] Check responsive design on different devices
- [ ] Verify SEO meta tags
- [ ] Check performance with Lighthouse
