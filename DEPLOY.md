# Vercel Deployment Guide

This guide will walk you through deploying your expense tracker to Vercel.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- A Vercel account (free at [vercel.com](https://vercel.com))
- Your project pushed to a Git repository
- Supabase project with database setup

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo-name&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Environment Variables

Add these environment variables in Vercel dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

To find these values:
1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the Project URL and Anon/Public key

### 4. Deploy

Click "Deploy" and wait for the build to complete. Your app will be live at:
`https://your-project-name.vercel.app`

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Environment Variables Setup

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Supabase Dashboard → Settings → API |

### Development vs Production

- **Development**: Use `.env.local` file
- **Production**: Set in Vercel dashboard → Settings → Environment Variables

## Troubleshooting

### Build Issues

If you encounter build errors:

1. **Check Node.js version**: Vercel uses Node.js 18+ by default
2. **Verify environment variables**: Ensure all required env vars are set
3. **Check package.json**: Ensure all dependencies are listed

### Common Errors

#### "Module not found"
- Run `npm install` locally and push updated `package-lock.json`

#### "Build failed"
- Check the build logs in Vercel dashboard
- Ensure all environment variables are properly set

#### "404 on refresh"
- This is handled automatically by Next.js and Vercel

## Continuous Deployment

Vercel automatically deploys when you push to:
- `main` branch → Production deployment
- Any other branch → Preview deployment

## Monitoring

- **Analytics**: Enable Vercel Analytics in project settings
- **Performance**: Check Core Web Vitals in dashboard
- **Errors**: Monitor function logs and error tracking

## Manual Deploy via CLI

### Install Vercel CLI

```bash
npm i -g vercel
```

### Deploy

```bash
vercel --prod
```

### Link to existing project

```bash
vercel link
```

## Database Considerations

### Supabase Connection

Ensure your Supabase project allows connections from Vercel:
1. Go to Supabase Dashboard → Settings → Database
2. Add `0.0.0.0/0` to IP restrictions (or specific Vercel IP ranges)

### Database Migrations

After deployment, run migrations:
1. Go to Supabase Dashboard → SQL Editor
2. Run your migration scripts

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js on Vercel**: [vercel.com/docs/frameworks/nextjs](https://vercel.com/docs/frameworks/nextjs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)

## Security Checklist

- [ ] Environment variables properly set
- [ ] Database access configured
- [ ] No sensitive data in code
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Custom domain SSL configured (if using custom domain)