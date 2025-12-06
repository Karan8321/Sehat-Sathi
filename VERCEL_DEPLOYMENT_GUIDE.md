# Step-by-Step Vercel Deployment Guide for Sehat-Sathi

## Prerequisites
- ✅ GitHub account
- ✅ Vercel account (free at https://vercel.com)
- ✅ All environment variables ready (Groq API key, SMTP credentials, etc.)

---

## STEP 1: Prepare Your Code

### 1.1 Update API Base URL (Already Done)
The frontend now uses environment variables for the API URL.

### 1.2 Create .gitignore (if not exists)
Make sure `.env` files are ignored:
```
.env
.env.local
.env*.local
api/.env
frontend/.env.local
node_modules/
.next/
```

---

## STEP 2: Push Code to GitHub

### 2.1 Initialize Git Repository (if not already done)
```bash
cd C:\Users\kusha\OneDrive\Desktop\Sehat-Sathi
git init
git add .
git commit -m "Initial commit - Ready for Vercel deployment"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `sehat-sathi` (or your preferred name)
3. Set to **Public** or **Private** (your choice)
4. **DO NOT** initialize with README, .gitignore, or license
5. Click **Create repository**

### 2.3 Push Code to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/sehat-sathi.git
git branch -M main
git push -u origin main
```
Replace `YOUR_USERNAME` with your GitHub username.

---

## STEP 3: Deploy to Vercel

### 3.1 Sign Up / Login to Vercel
1. Go to https://vercel.com
2. Click **Sign Up** (or **Log In** if you have an account)
3. Sign up with GitHub (recommended)

### 3.2 Import Your Project
1. After logging in, click **Add New...** → **Project**
2. Find your `sehat-sathi` repository
3. Click **Import**

### 3.3 Configure Project Settings

**Root Directory:** Leave empty (or set to project root)

**Framework Preset:** Next.js (auto-detected)

**Build Command:** 
```
cd frontend && npm install && npm run build
```

**Output Directory:** 
```
frontend/.next
```

**Install Command:**
```
npm install
```

**Node.js Version:** 20.x (or latest)

---

## STEP 4: Configure Environment Variables

### 4.1 Add Environment Variables in Vercel

In the Vercel project settings, go to **Settings** → **Environment Variables** and add:

#### Backend Variables (Server-side only):
```
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_smtp_app_password
EMAIL_FROM=your_email@gmail.com
HOSPITAL_ALERT_TO=recipient@example.com
VAPI_API_KEY=your_vapi_api_key_here
VAPI_BASE_URL=https://api.vapi.ai
VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```

#### Frontend Variables (Public - accessible in browser):
```
NEXT_PUBLIC_API_BASE=/api
```

**Important Notes:**
- For each variable, select **Production**, **Preview**, and **Development** environments
- Click **Save** after adding each variable
- The `NEXT_PUBLIC_` prefix makes variables available in the browser

---

## STEP 5: Deploy

### 5.1 Start Deployment
1. After configuring environment variables, click **Deploy**
2. Wait for the build to complete (usually 2-5 minutes)
3. You'll see build logs in real-time

### 5.2 Check Build Logs
Watch for any errors. Common issues:
- Missing dependencies → Check `package.json` files
- Build errors → Check the error messages
- Environment variable errors → Verify all variables are set

---

## STEP 6: Verify Deployment

### 6.1 Test Your Live Site
1. After deployment completes, Vercel will give you a URL like:
   `https://sehat-sathi.vercel.app`
2. Visit the URL
3. Test the application:
   - Check if the homepage loads
   - Try the demo page
   - Test microphone functionality
   - Test hospital matching

### 6.2 Check API Endpoints
Test the API:
- `https://your-project.vercel.app/api/health` (should return `{"status":"ok"}`)
- `https://your-project.vercel.app/api/triage/chat` (POST request)

---

## STEP 7: Custom Domain (Optional)

### 7.1 Add Custom Domain
1. Go to **Settings** → **Domains**
2. Enter your domain name
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

---

## Troubleshooting

### Issue: Build Fails
**Solution:**
- Check build logs for specific errors
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible

### Issue: API Routes Not Working
**Solution:**
- Verify `vercel.json` rewrites are correct
- Check that `api/index.js` exports a handler function
- Verify environment variables are set

### Issue: Environment Variables Not Working
**Solution:**
- Make sure variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Issue: Frontend Can't Connect to API
**Solution:**
- Verify `NEXT_PUBLIC_API_BASE=/api` is set
- Check browser console for errors
- Verify API routes are accessible

---

## Post-Deployment Checklist

- [ ] Homepage loads correctly
- [ ] Demo page is accessible
- [ ] Microphone feature works
- [ ] API health check returns OK
- [ ] Hospital matching works
- [ ] Email alerts work (test with a real email)
- [ ] All environment variables are set
- [ ] No console errors in browser
- [ ] Mobile responsiveness works

---

## Updating Your Deployment

After making changes:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```
Vercel will automatically redeploy!

---

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables
4. Check Vercel documentation: https://vercel.com/docs

---

## Quick Reference: Environment Variables Summary

**Required for Backend:**
- `GROQ_API_KEY` - Your Groq API key
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` - Email configuration

**Required for Frontend:**
- `NEXT_PUBLIC_API_BASE` - Set to `/api` for Vercel

**Optional:**
- `VAPI_API_KEY`, `VAPI_ASSISTANT_ID` - For voice calls
- `HOSPITAL_ALERT_TO` - Default email recipient

