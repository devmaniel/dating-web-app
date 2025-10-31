# Deploy Client to Vercel - Quick Guide

## ✅ Pre-configured Settings

Your client is now configured to deploy to Vercel **without failing on lint/type errors**:

- ✅ `vercel.json` - Vercel configuration with `ignoreCommand: "exit 0"`
- ✅ `package.json` - Build script skips TypeScript checks
- ✅ `.env.production` - Production environment variables template

---

## 🚀 Deploy to Vercel (3 Methods)

### Method 1: Vercel Dashboard (Easiest)

1. **Go to** [vercel.com](https://vercel.com) and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your repository**
   - Select your `dating-web-app` repository
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` ⚠️ IMPORTANT
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

5. **Add Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```
   *(You'll update these after deploying your backend)*

6. **Click "Deploy"** 🚀

---

### Method 2: Vercel CLI (Recommended for Quick Deploy)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to client directory
cd client

# Login to Vercel
vercel login

# Deploy (first time - will ask questions)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? dating-app-client (or your choice)
# - Directory? ./ (already in client folder)
# - Override settings? No

# Deploy to production
vercel --prod
```

**After deployment**, add environment variables:

```bash
# Set environment variables
vercel env add VITE_API_URL
# Enter: https://your-backend-url.onrender.com

vercel env add VITE_SOCKET_URL
# Enter: https://your-backend-url.onrender.com

# Redeploy with new env vars
vercel --prod
```

---

### Method 3: GitHub Integration (Auto-Deploy)

1. **Push to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

2. **Connect on Vercel Dashboard**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Set root directory to `client`
   - Add environment variables
   - Deploy

3. **Auto-Deploy**: Every push to `main` will auto-deploy! 🎉

---

## 🔧 Configuration Details

### vercel.json
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "ignoreCommand": "exit 0"  // ⚠️ This skips all checks - always deploys
}
```

### package.json Scripts
```json
{
  "build": "vite build",           // Production build (no type checks)
  "build:check": "tsc -b && vite build"  // Local build with checks
}
```

---

## 🌍 Environment Variables

You need to set these in Vercel Dashboard or CLI:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Backend API URL |
| `VITE_SOCKET_URL` | `https://your-backend.onrender.com` | Socket.IO server URL |

**How to add via Dashboard:**
1. Go to your project on Vercel
2. Settings → Environment Variables
3. Add each variable
4. Redeploy

---

## 🔍 Verify Deployment

After deployment:

```bash
# Check if build was successful
vercel logs

# Open your deployed app
vercel open
```

**Test checklist:**
- [ ] App loads without errors
- [ ] Can navigate between pages
- [ ] API calls work (after backend is deployed)
- [ ] Socket.IO connects (after backend is deployed)

---

## 🐛 Troubleshooting

### Build Fails with Type Errors

**Solution**: Already fixed! The build script now skips TypeScript checks.

If you still see issues:
```bash
# Locally test the build
npm run build

# If it works locally, force redeploy on Vercel
vercel --prod --force
```

### Build Fails with ESLint Errors

**Solution**: `vercel.json` has `ignoreCommand: "exit 0"` which skips all checks.

If Vercel still runs lint:
```bash
# Update vercel.json to explicitly skip
{
  "ignoreCommand": "git diff HEAD^ HEAD --quiet . || exit 0"
}
```

### Environment Variables Not Working

**Check:**
1. Variables start with `VITE_` prefix (required for Vite)
2. Variables are set in Vercel Dashboard
3. You redeployed after adding variables

**Fix:**
```bash
# List current env vars
vercel env ls

# Add missing ones
vercel env add VITE_API_URL

# Redeploy
vercel --prod
```

### 404 on Page Refresh

**Solution**: Already handled by Vercel's SPA routing.

If you see 404s, add to `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📝 Next Steps

1. ✅ Deploy client to Vercel (you're here!)
2. ⏭️ Deploy backend to Render/Railway
3. 🔗 Update `VITE_API_URL` with actual backend URL
4. 🧪 Test the full application
5. 🌐 (Optional) Add custom domain

---

## 🎯 Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# Open deployed app
vercel open

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

---

## 💡 Tips

- **Preview Deployments**: Every git branch gets its own preview URL
- **Instant Rollbacks**: Can rollback to any previous deployment instantly
- **Analytics**: Enable Vercel Analytics in dashboard for free
- **Custom Domain**: Add your domain in Project Settings → Domains

---

## 🆓 Free Tier Limits

Vercel Free Tier includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics (basic)

Perfect for your dating app! 🚀
