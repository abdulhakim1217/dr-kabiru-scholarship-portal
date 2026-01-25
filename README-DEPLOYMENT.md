# Dr. Kabiru Scholarship Portal - Deployment Guide

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abdulhakim1217/Dr-kabiru-scholarship-portal)

## Manual Deployment Steps

### 1. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import repository: `Dr-kabiru-scholarship-portal`
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Environment Variables (Add in Vercel)

```
VITE_SUPABASE_URL=https://tpwvsbvlgmdebvhmmoub.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwd3ZzYnZsZ21kZWJ2aG1tb3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NzczNTksImV4cCI6MjA4MjA1MzM1OX0.qFPfPkVRMV1GfMIBS5ym7Qn9gbAHy49DZmWh1fpJ0S0
```

### 3. Create Admin User (MANUAL STEP)

**Option A: Via Supabase Dashboard**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `tpwvsbvlgmdebvhmmoub`
3. Go to **Authentication → Users**
4. Click **"Add User"**
5. Fill in:
   - Email: `admin@drkabiruscholarship.com`
   - Password: `DrKabiru2025!Admin`
   - ✅ Check "Confirm email"
6. Click **"Add User"**
7. **Copy the User UUID** (you'll need this)

**Option B: Add Admin Role**
1. Go to **Table Editor → user_roles**
2. Click **"Insert" → "Insert row"**
3. Fill in:
   - `user_id`: (paste UUID from step A7)
   - `role`: `admin`
4. Click **"Save"**

### 4. Test Admin Access

After deployment:
1. Visit: `https://your-vercel-url.vercel.app/admin`
2. Login with:
   - Email: `admin@drkabiruscholarship.com`
   - Password: `DrKabiru2025!Admin`
3. Should redirect to `/admin/dashboard`

## 🎯 Features Available

### For Applicants:
- ✅ Multi-step application form
- ✅ Document upload (transcripts, letters)
- ✅ Community selection
- ✅ Real-time form validation

### For Admins:
- ✅ View all applications
- ✅ Search and filter applications
- ✅ Update application status
- ✅ Export to Excel/CSV
- ✅ View uploaded documents
- ✅ Application statistics dashboard

## 🔧 Troubleshooting

### If admin login doesn't work:
1. Check if user was created in Supabase Auth
2. Verify user_roles table has admin entry
3. Check browser console for errors

### If applications don't submit:
1. Check Supabase RLS policies
2. Verify environment variables in Vercel
3. Check network tab for API errors

## 📞 Support

If you need help, check:
1. Supabase project logs
2. Vercel deployment logs
3. Browser developer console