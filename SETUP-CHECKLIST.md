# 🚀 Dr. Kabiru Scholarship Portal - Setup Checklist

## ✅ AUTOMATED STEPS (COMPLETED)
- [x] Project configured for Vercel deployment
- [x] Environment variables set up
- [x] Database schema ready
- [x] Admin dashboard functional
- [x] Application form working
- [x] GitHub repository ready

## 🔧 MANUAL STEPS (YOU NEED TO DO)

### Step 1: Deploy to Vercel (5 minutes)
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import GitHub repo: `Dr-kabiru-scholarship-portal`
4. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://tpwvsbvlgmdebvhmmoub.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwd3ZzYnZsZ21kZWJ2aG1tb3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NzczNTksImV4cCI6MjA4MjA1MzM1OX0.qFPfPkVRMV1GfMIBS5ym7Qn9gbAHy49DZmWh1fpJ0S0
   ```
5. Click "Deploy"

### Step 2: Create Admin User (3 minutes)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/tpwvsbvlgmdebvhmmoub)
2. **Authentication → Users → Add User**
   - Email: `admin@drkabiruscholarship.com`
   - Password: `DrKabiru2025!Admin`
   - ✅ Confirm email
3. **Copy the User UUID**
4. **Table Editor → user_roles → Insert**
   - user_id: (paste UUID)
   - role: `admin`

### Step 3: Test Everything (2 minutes)
1. Visit your Vercel URL + `/admin`
2. Login with admin credentials
3. Check dashboard works
4. Test application form at `/`

## 🎯 WHAT YOU'LL HAVE AFTER SETUP

### Live Website Features:
- ✅ Public application form
- ✅ Document upload functionality
- ✅ Admin login portal
- ✅ Application management dashboard
- ✅ Export capabilities
- ✅ Status tracking

### Admin Capabilities:
- View all applications
- Search and filter
- Update application status
- Download documents
- Export to Excel/CSV
- Application statistics

## 🔗 Important URLs After Deployment
- **Public Site**: `https://your-app.vercel.app`
- **Admin Login**: `https://your-app.vercel.app/admin`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/tpwvsbvlgmdebvhmmoub`

## 📞 Need Help?
If anything doesn't work:
1. Check Vercel deployment logs
2. Check Supabase project logs
3. Check browser console for errors

**Admin Credentials:**
- Email: `admin@drkabiruscholarship.com`
- Password: `DrKabiru2025!Admin`