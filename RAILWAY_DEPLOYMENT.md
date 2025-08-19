# 🚀 Deploy to Railway (FREE) - Step by Step Guide

## Why Railway?
- ✅ **$0/month** (500 hours free monthly)
- ✅ **No cold starts** (unlike Render)
- ✅ **Automatic HTTPS** with custom domains
- ✅ **SQLite persistence** (your database stays)
- ✅ **Environment variables** support
- ✅ **Deploy from GitHub** (auto-deploy on push)

---

## 🎯 **Step 1: Create Railway Account**

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended for easy deployment)

---

## 🎯 **Step 2: Push Your Code to GitHub**

```bash
# If you haven't already, initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit - CCH Axcess Intelligence"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

---

## 🎯 **Step 3: Deploy to Railway**

### Option A: Deploy from GitHub (Recommended)
1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository
4. Railway will automatically detect it's a Node.js app

### Option B: Deploy via CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

---

## 🎯 **Step 4: Configure Environment Variables**

In Railway dashboard:

1. Go to your project → **Variables** tab
2. Add these **REQUIRED** variables:

```env
NODE_ENV=production
PORT=3001

# AI Provider Keys (REQUIRED)
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here

# Security (generate random strings)
ADMIN_KEY=your_admin_key_here
SESSION_SECRET=your_session_secret_here
JWT_SECRET=your_jwt_secret_here

# Optional: Custom domain
FRONTEND_URL=https://your-app-name.up.railway.app
```

### 🔑 **How to Get API Keys**

**Anthropic (Claude):**
1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up and get $5 free credit
3. Go to API Keys → Create Key
4. Copy the key (starts with `sk-ant-...`)

**OpenAI (GPT):**
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up and get $5 free credit
3. Go to API Keys → Create new secret key
4. Copy the key (starts with `sk-...`)

---

## 🎯 **Step 5: Generate Security Keys**

Run these commands to generate secure keys:

```bash
# Generate random keys (copy the output)
node -e "console.log('ADMIN_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🎯 **Step 6: Deploy & Test**

1. **Automatic Deploy**: Railway will build and deploy automatically
2. **Get Your URL**: Railway will provide a URL like `https://your-app-name.up.railway.app`
3. **Test**: Visit the URL to see your app live!

### 🔍 **Health Check**
Visit: `https://your-app-name.up.railway.app/api/health`

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

---

## 🎯 **Step 7: Custom Domain (Optional)**

1. In Railway dashboard → **Settings** → **Domains**
2. Click **"Custom Domain"**
3. Add your domain (e.g., `myapp.com`)
4. Update DNS records as shown
5. Update `FRONTEND_URL` environment variable

---

## 🚨 **Troubleshooting**

### Build Fails?
- Check the **Deploy** logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### App Won't Start?
- Check **Runtime** logs in Railway dashboard  
- Verify environment variables are set
- Ensure API keys are valid

### Database Issues?
- Your SQLite database persists in Railway
- Check `/data` directory permissions
- Database recreates automatically if missing

### CORS Errors?
- Verify `FRONTEND_URL` matches your Railway domain
- Check browser console for exact error
- Ensure API endpoints use `/api/` prefix

---

## 💰 **Cost Breakdown**

- **Railway**: $0/month (500 hours = ~20 days uptime)
- **Anthropic**: $5 free credit (~1M tokens)
- **OpenAI**: $5 free credit (~1M tokens)
- **Domain** (optional): $10-15/year

**Total monthly cost: $0** (for moderate usage)

---

## 🎉 **Success!**

Your CCH Axcess Intelligence app is now live at:
`https://your-app-name.up.railway.app`

### What's Next?
- Share the URL with users
- Monitor usage in Railway dashboard
- Add custom domain if needed
- Scale up if you exceed free tier

### Need Help?
- Railway has excellent [documentation](https://docs.railway.app)
- Check Railway dashboard logs for issues
- Review this guide's troubleshooting section

---

**🎯 Your app is production-ready with enterprise-grade security, AI integration, and automatic scaling!**
