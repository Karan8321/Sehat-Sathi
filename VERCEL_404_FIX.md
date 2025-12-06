# Fixing 404 Error on Vercel

## The Problem
You're getting a 404 NOT_FOUND error because Vercel isn't routing API requests correctly.

## Solution: Update Vercel Project Settings

### Option 1: Fix in Vercel Dashboard (Recommended)

1. **Go to your Vercel project dashboard**
2. Click **Settings** → **General**
3. Scroll to **Build & Development Settings**

4. **Update these settings:**

   **Root Directory:** Leave empty (or set to project root)
   
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

5. **Go to Settings → Functions**
   - Make sure **Node.js Version** is set to **20.x** (or 18.x)

6. **Redeploy:**
   - Go to **Deployments** tab
   - Click the **3 dots** (⋯) on the latest deployment
   - Click **Redeploy**

### Option 2: Alternative vercel.json (If Option 1 doesn't work)

If the above doesn't work, try this simpler `vercel.json`:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/index.js"
    }
  ]
}
```

Then:
1. Commit and push this change
2. Vercel will auto-redeploy

### Option 3: Check API Handler Export

Make sure `api/index.js` exports the handler correctly (already done):

```javascript
export default async function handler(req, res) {
  return app(req, res);
}
```

## Testing After Fix

1. **Test API health endpoint:**
   ```
   https://your-project.vercel.app/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test from frontend:**
   - Visit your site
   - Open browser console (F12)
   - Check for API errors
   - Try the demo page

## Common Issues

### Still Getting 404?
- Check Vercel deployment logs for errors
- Verify `api/index.js` exists and exports handler
- Make sure environment variables are set
- Try accessing `/api/health` directly in browser

### Build Fails?
- Check that all dependencies are in `package.json`
- Verify Node.js version is 18+ or 20
- Check build logs in Vercel dashboard

### API Returns 500?
- Check environment variables are set correctly
- Look at function logs in Vercel dashboard
- Verify GROQ_API_KEY and other vars are correct

## Quick Checklist

- [ ] Updated Vercel project settings (Root Directory, Build Command, Output Directory)
- [ ] Set Node.js version to 20.x in Functions settings
- [ ] All environment variables are set
- [ ] `vercel.json` is in project root
- [ ] `api/index.js` exports handler function
- [ ] Redeployed after making changes
- [ ] Tested `/api/health` endpoint

