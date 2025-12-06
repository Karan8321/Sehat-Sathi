# 🚀 VERCEL DEPLOYMENT - STEP BY STEP GUIDE

## ⚡ QUICK START (5 Steps)

### STEP 1: Push Code to GitHub

**1.1 Open PowerShell in your project folder:**
```powershell
cd C:\Users\kusha\OneDrive\Desktop\Sehat-Sathi
```

**1.2 Initialize Git (if not done):**
```powershell
git init
git add .
git commit -m "Ready for Vercel"
```

**1.3 Create GitHub Repository:**
- Go to: https://github.com/new
- Name: `sehat-sathi`
- Click **Create repository**

**1.4 Push to GitHub:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/sehat-sathi.git
git branch -M main
git push -u origin main
```
*(Replace YOUR_USERNAME with your GitHub username)*

---

### STEP 2: Sign Up for Vercel

1. Go to: **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel

---

### STEP 3: Import Project to Vercel

1. Click **Add New...** → **Project**
2. Find `sehat-sathi` repository
3. Click **Import**

**Configure these settings:**
- **Root Directory:** Leave empty
- **Framework:** Next.js (auto-detected)
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/.next`
- **Install Command:** `npm install`

---

### STEP 4: Add Environment Variables

**Go to:** Settings → Environment Variables

**Add these 9 variables (check Production, Preview, Development for each):**

| Key | Value | Notes |
|-----|-------|-------|
| `GROQ_API_KEY` | `your_groq_api_key_here` | Your Groq key |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Model name |
| `SMTP_HOST` | `smtp.gmail.com` | Email server |
| `SMTP_PORT` | `587` | Email port |
| `SMTP_USER` | `your_email@gmail.com` | Your email |
| `SMTP_PASS` | `your_app_password` | App password |
| `EMAIL_FROM` | `your_email@gmail.com` | Sender email |
| `HOSPITAL_ALERT_TO` | `recipient@example.com` | Recipient |
| `NEXT_PUBLIC_API_BASE` | `/api` | **IMPORTANT!** |

**For each variable:**
1. Enter Key
2. Enter Value
3. ✅ Check Production
4. ✅ Check Preview  
5. ✅ Check Development
6. Click **Save**

---

### STEP 5: Deploy!

1. Click **Deploy** button
2. Wait 2-5 minutes
3. Get your live URL: `https://your-project.vercel.app`

---

## ✅ TEST YOUR DEPLOYMENT

**Test these URLs:**
1. Homepage: `https://your-url.vercel.app`
2. Demo page: `https://your-url.vercel.app/demo`
3. API health: `https://your-url.vercel.app/api/health` (should show `{"status":"ok"}`)

---

## 🔧 TROUBLESHOOTING

### Build Fails?
- Check build logs in Vercel
- Verify all dependencies in `package.json`

### API Not Working?
- Verify `NEXT_PUBLIC_API_BASE=/api` is set
- Check `vercel.json` exists
- Test `/api/health` endpoint

### Environment Variables Not Working?
- Make sure you checked all 3 environments (Production/Preview/Development)
- Redeploy after adding variables

---

## 📝 AFTER DEPLOYMENT

**To update your site:**
```powershell
git add .
git commit -m "Update"
git push origin main
```
Vercel auto-deploys! 🎉

---

## 📞 NEED HELP?

1. Check Vercel dashboard → Deployment logs
2. Check browser console (F12) for errors
3. Verify all environment variables are set

**You're done! 🚀**

