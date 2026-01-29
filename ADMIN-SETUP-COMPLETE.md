# 🔐 Complete Admin Setup Guide - Dr. Kabiru Scholarship Portal

## 🎯 **Current Status & Updated Instructions**

### **Admin Login Credentials:**
```
📧 Email: admin@drkabiruscholarship.com
🔑 Password: DrKabiru2025!Admin
🌐 Admin URL: https://your-vercel-url.vercel.app/admin
```

## 🚀 **Step-by-Step Admin Creation**

### **Method 1: Supabase Dashboard (Recommended)**

#### **Step 1: Access Your Supabase Project**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Login to your account
3. Select your scholarship portal project

#### **Step 2: Create Admin User**
1. Click **"Authentication"** in left sidebar
2. Click **"Users"** tab
3. Click **"Add User"** button
4. Fill in the form:
   ```
   Email: admin@drkabiruscholarship.com
   Password: DrKabiru2025!Admin
   ✅ Confirm email: CHECK THIS BOX
   ```
5. Click **"Add User"**
6. **IMPORTANT**: Copy the User UID (looks like: `abc123-def456-ghi789`)

#### **Step 3: Add Admin Role**
1. Click **"Table Editor"** in left sidebar
2. Find and click **"user_roles"** table
3. Click **"Insert"** → **"Insert row"**
4. Fill in:
   ```
   id: (leave empty - auto-generates)
   user_id: (paste the User UID from Step 2)
   role: admin
   created_at: (leave empty - auto-generates)
   ```
5. Click **"Save"**

### **Method 2: SQL Editor (Alternative)**

If you prefer SQL, use this in Supabase SQL Editor:

```sql
-- Step 1: Check if user exists
SELECT id, email, email_confirmed_at FROM auth.users 
WHERE email = 'admin@drkabiruscholarship.com';

-- Step 2: If user exists, add admin role (replace USER_UUID_HERE)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 3: Verify admin user setup
SELECT 
  u.email,
  u.email_confirmed_at,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

## 🔧 **Troubleshooting Common Issues**

### **Issue 1: "Invalid login credentials"**
**Causes:**
- User not created in Authentication
- Wrong email/password
- Email not confirmed

**Solutions:**
1. Verify user exists in Authentication → Users
2. Check email is exactly: `admin@drkabiruscholarship.com`
3. Check password is exactly: `DrKabiru2025!Admin`
4. Ensure email is confirmed (green checkmark in Users list)

### **Issue 2: "Access denied" or redirected back to login**
**Causes:**
- Admin role not added to user_roles table
- user_roles table doesn't exist

**Solutions:**
1. Check Table Editor → user_roles for your user entry
2. Verify role is exactly: `admin`
3. Run database migration if tables don't exist

### **Issue 3: Tables don't exist**
**Solution:** Run this SQL in SQL Editor:
```sql
-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'user', 'reviewer')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );
```

## ✅ **Verification Steps**

### **Step 1: Check User Creation**
1. Go to Authentication → Users
2. Find `admin@drkabiruscholarship.com`
3. Verify email is confirmed (green checkmark)

### **Step 2: Check Admin Role**
1. Go to Table Editor → user_roles
2. Find row with your user_id and role = 'admin'

### **Step 3: Test Login**
1. Go to: `https://your-vercel-url.vercel.app/admin`
2. Enter credentials:
   - Email: `admin@drkabiruscholarship.com`
   - Password: `DrKabiru2025!Admin`
3. Should redirect to `/admin/dashboard`

## 🎯 **What You'll See After Successful Login**

### **Admin Dashboard Features:**
- **📊 Statistics Cards**: Total, Pending, Approved, Rejected applications
- **📋 Applications Table**: All submitted applications
- **🔍 Search & Filter**: By name, email, university, community, status
- **👁️ View Details**: Click "View" to see full application + documents
- **📝 Status Updates**: Change application status
- **📊 Export Options**: Download as Excel or CSV

### **Application Management:**
- **View Documents**: Transcripts, letters, supporting docs
- **Update Status**: Pending → Under Review → Approved/Rejected
- **Search Applications**: By any field
- **Export Data**: For reporting and backup

## 🔒 **Security Best Practices**

### **After First Login:**
1. **Consider changing password** (optional but recommended)
2. **Only access from secure networks**
3. **Log out when finished**
4. **Don't share credentials**

### **Regular Maintenance:**
1. **Export data regularly** for backup
2. **Monitor application submissions**
3. **Update application statuses promptly**

## 📞 **Still Having Issues?**

### **Quick Diagnostic:**
1. **Check browser console** (F12) for error messages
2. **Try incognito/private browsing** mode
3. **Clear browser cache** (Ctrl+F5)
4. **Verify Supabase project** is active and accessible

### **Database Issues:**
1. **Check Supabase project status** in dashboard
2. **Verify environment variables** in Vercel
3. **Test database connection** by submitting a test application

### **Contact Information:**
- Check Supabase project logs for detailed error messages
- Verify Vercel deployment logs if login page doesn't load
- Ensure your Vercel environment variables are correctly set

## 🎉 **Success Confirmation**

You'll know everything is working when:
- ✅ You can access `/admin` URL
- ✅ Login with provided credentials works
- ✅ You're redirected to `/admin/dashboard`
- ✅ You can see the admin interface with statistics
- ✅ You can view any submitted applications (if any exist)

**Your admin portal is now ready to manage scholarship applications! 🎓✨**