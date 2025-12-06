# 🚀 Step-by-Step Vercel Deployment Guide

## 📋 Prerequisites Checklist
- [ ] GitHub account (free at github.com)
- [ ] Vercel account (free at vercel.com)
- [ ] Groq API key ready
- [ ] SMTP credentials ready (Gmail app password)

---

## STEP 1: Prepare Your Code for GitHub

### 1.1 Check .gitignore
Make sure you have a `.gitignore` file in the root with:
```
.env
.env.local
.env*.local
api/.env
frontend/.env.local
node_modules/
.next/
.DS_Store
```

### 1.2 Initialize Git (if not done)
Open PowerShell in your project folder:
```powershell
cd C:\Users\kusha\OneDrive\Desktop\Sehat-Sathi
git init
git add .
git commit -m "Ready for Vercel deployment"
```

---

## STEP 2: Push to GitHub

### 2.1 Create GitHub Repository
1. Go to **https://github.com/new**
2. Repository name: `sehat-sathi`
3. Choose **Public** or **Private**
4. **DO NOT** check any boxes (no README, .gitignore, license)
5. Click **Create repository**

### 2.2 Push Your Code
Copy the commands GitHub shows you, or use:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/sehat-sathi.git
git branch -M main
git push -u origin main
```
**Replace `YOUR_USERNAME` with your actual GitHub username!**

---

## STEP 3: Deploy to Vercel

### 3.1 Sign Up for Vercel
1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub

### 3.2 Import Your Project
1. Click **Add New...** → **Project**
2. Find your `sehat-sathi` repository
3. Click **Import**

### 3.3 Configure Project Settings

**IMPORTANT:** Set these in Vercel:

**Root Directory:** Leave empty (or click "Edit" and set to project root)

**Framework Preset:** Next.js (should auto-detect)

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

---

## STEP 4: Add Environment Variables

### 4.1 Go to Environment Variables
In Vercel project settings:
1. Click **Settings** tab
2. Click **Environment Variables** in left sidebar

### 4.2 Add These Variables

**For each variable:**
- Enter the **Key** (name)
- Enter the **Value** (your actual value)
- Select **Production**, **Preview**, and **Development** (check all three)
- Click **Save**

#### Variable List:

**1. GROQ_API_KEY**
```
Key: GROQ_API_KEY
Value: your_groq_api_key_here
Environments: ✅ Production ✅ Preview ✅ Development
```

**2. GROQ_MODEL**
```
Key: GROQ_MODEL
Value: llama-3.1-8b-instant
Environments: ✅ Production ✅ Preview ✅ Development
```

**3. SMTP_HOST**
```
Key: SMTP_HOST
Value: smtp.gmail.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**4. SMTP_PORT**
```
Key: SMTP_PORT
Value: 587
Environments: ✅ Production ✅ Preview ✅ Development
```

**5. SMTP_USER**
```
Key: SMTP_USER
Value: your_email@gmail.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**6. SMTP_PASS**
```
Key: SMTP_PASS
Value: your_app_password
Environments: ✅ Production ✅ Preview ✅ Development
```

**7. EMAIL_FROM**
```
Key: EMAIL_FROM
Value: your_email@gmail.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**8. HOSPITAL_ALERT_TO**
```
Key: HOSPITAL_ALERT_TO
Value: recipient@example.com
Environments: ✅ Production ✅ Preview ✅ Development
```

**9. NEXT_PUBLIC_API_BASE** (Important for frontend!)
```
Key: NEXT_PUBLIC_API_BASE
Value: /api
Environments: ✅ Production ✅ Preview ✅ Development
```

**10. VAPI_API_KEY** (Optional - if you have it)
```
Key: VAPI_API_KEY
Value: your_vapi_api_key_here
Environments: ✅ Production ✅ Preview ✅ Development
```

**11. VAPI_BASE_URL** (Optional)
```
Key: VAPI_BASE_URL
Value: https://api.vapi.ai
Environments: ✅ Production ✅ Preview ✅ Development
```

**12. VAPI_ASSISTANT_ID** (Optional)
```
Key: VAPI_ASSISTANT_ID
Value: your_vapi_assistant_id_here
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## STEP 5: Deploy!

### 5.1 Start Deployment
1. After adding all environment variables, scroll up
2. Click **Deploy** button
3. Wait for build to complete (2-5 minutes)

### 5.2 Watch Build Logs
- You'll see real-time build progress
- Watch for any errors
- If build fails, check the error message

---

## STEP 6: Test Your Live Site

### 6.1 Get Your URL
After deployment, Vercel gives you a URL like:
```
https://sehat-sathi-xxxxx.vercel.app
```

### 6.2 Test Checklist
- [ ] Visit the homepage - does it load?
- [ ] Go to `/demo` page - does it load?
- [ ] Test API: `https://your-url.vercel.app/api/health` (should show `{"status":"ok"}`)
- [ ] Try microphone feature
- [ ] Test hospital matching
- [ ] Check browser console for errors (F12 → Console tab)

---

## STEP 7: Fix API Base URL Issue

The frontend needs to know the API URL. I've updated the code to use `/api` in production.

**If API calls don't work:**
1. Check browser console (F12)
2. Verify `NEXT_PUBLIC_API_BASE=/api` is set in Vercel
3. Redeploy after adding the variable

---

## Common Issues & Solutions

### ❌ Build Fails
**Solution:**
- Check build logs for specific error
- Make sure all `package.json` files have correct dependencies
- Verify Node.js version (should be 18+ or 20)

### ❌ API Routes Return 404
**Solution:**
- Check `vercel.json` is correct
- Verify `api/index.js` exports handler function
- Make sure routes are configured correctly

### ❌ Environment Variables Not Working
**Solution:**
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive!)

### ❌ Frontend Can't Connect to API
**Solution:**
- Verify `NEXT_PUBLIC_API_BASE=/api` is set
- Check browser console for errors
- Test API endpoint directly: `https://your-url.vercel.app/api/health`

---

## Updating Your Site

After making code changes:
```powershell
git add .
git commit -m "Your changes"
git push origin main
```
Vercel will **automatically redeploy**! 🎉

---

## Quick Reference

**Your Vercel Dashboard:**
- https://vercel.com/dashboard

**Your Project Settings:**
- Settings → Environment Variables
- Settings → General (for build settings)

**Deployment Logs:**
- Click on any deployment to see logs

---

## Need Help?

1. Check Vercel docs: https://vercel.com/docs
2. Check build logs in Vercel dashboard
3. Check browser console (F12) for frontend errors
4. Verify all environment variables are set correctly

---

## ✅ Final Checklist

Before going live, verify:
- [ ] All environment variables are set
- [ ] Build completes successfully
- [ ] Homepage loads
- [ ] Demo page works
- [ ] API health check works (`/api/health`)
- [ ] Microphone feature works
- [ ] Hospital matching works
- [ ] No console errors
- [ ] Mobile view works (test on phone)

**You're all set! 🚀**

