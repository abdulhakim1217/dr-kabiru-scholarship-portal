# 🔍 Admin Login Diagnostic & Fix Guide

## 🎯 **Current Issue**
You're getting "credentials login error" when trying to access the admin portal with:
- Email: `admin@drkabiruscholarship.com`
- Password: `DrKabiru2025!Admin`

## 🔧 **Step-by-Step Diagnostic Process**

### **Step 1: Check Supabase Project Access**
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Login and select your project: `tpwvsbvlgmdebvhmmoub`
3. Verify you can access the project dashboard

### **Step 2: Run Diagnostic SQL**
1. Click **"SQL Editor"** in left sidebar
2. Click **"New Query"**
3. Copy and paste this diagnostic script:

```sql
-- DIAGNOSTIC SCRIPT - Run this first
-- This will show you exactly what's wrong

-- Check 1: Does user_roles table exist?
SELECT 
  'Table Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'user_roles'
    ) THEN '✅ user_roles table EXISTS'
    ELSE '❌ user_roles table MISSING'
  END as status;

-- Check 2: Does admin user exist in authentication?
SELECT 
  'Auth User Check' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.users 
      WHERE email = 'admin@drkabiruscholarship.com'
    ) THEN '✅ Admin user EXISTS in auth.users'
    ELSE '❌ Admin user MISSING from auth.users'
  END as status;

-- Check 3: Show admin user details
SELECT 
  'Admin User Details' as info_type,
  id as user_uuid,
  email,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email CONFIRMED'
    ELSE '❌ Email NOT CONFIRMED'
  END as email_status,
  created_at
FROM auth.users 
WHERE email = 'admin@drkabiruscholarship.com';

-- Check 4: Show all admin roles
SELECT 
  'Admin Roles' as info_type,
  user_id as role_uuid,
  role,
  created_at
FROM public.user_roles 
WHERE role = 'admin';

-- Check 5: Verify UUID matching
SELECT 
  'UUID Match Check' as check_type,
  ur.user_id as role_uuid,
  u.id as auth_uuid,
  u.email,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ UUID MATCHES real user'
    ELSE '❌ UUID does NOT match any user'
  END as status
FROM public.user_roles ur
LEFT JOIN auth.users u ON ur.user_id = u.id
WHERE ur.role = 'admin';
```

4. Click **"Run"** and review the results

## 📋 **Interpreting Diagnostic Results**

### **Scenario A: Admin user doesn't exist**
If you see: `❌ Admin user MISSING from auth.users`

**Fix:**
1. Go to **Authentication** → **Users**
2. Click **"Add User"**
3. Fill in:
   ```
   Email: admin@drkabiruscholarship.com
   Password: DrKabiru2025!Admin
   ✅ Confirm email: CHECK THIS BOX
   ```
4. Click **"Add User"**
5. Copy the generated UUID
6. Run the fix SQL below

### **Scenario B: Admin user exists but email not confirmed**
If you see: `❌ Email NOT CONFIRMED`

**Fix:**
1. Go to **Authentication** → **Users**
2. Find `admin@drkabiruscholarship.com`
3. Click the **"..."** menu → **"Send confirmation email"**
4. OR manually confirm by clicking **"..."** → **"Confirm email"**

### **Scenario C: UUID mismatch**
If you see: `❌ UUID does NOT match any user`

**Fix:** Run the complete fix SQL below

## 🛠️ **Complete Fix SQL Script**

After running diagnostics, run this complete fix:

```sql
-- COMPLETE FIX SCRIPT
-- Run this after diagnostics to fix all issues

-- Step 1: Create user_roles table if missing
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'user', 'reviewer')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Step 2: Enable RLS and create policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Step 3: Fix admin role assignment
DO $
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the actual admin user UUID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@drkabiruscholarship.com'
    LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
        -- Delete any incorrect admin role entries
        DELETE FROM public.user_roles WHERE role = 'admin';
        
        -- Insert correct admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE '✅ Admin role fixed for user: %', admin_user_id;
    ELSE
        RAISE NOTICE '❌ ERROR: Admin user not found. Create user first via Authentication UI.';
    END IF;
END;
$ LANGUAGE plpgsql;

-- Step 4: Final verification
SELECT 
  '🎉 FINAL VERIFICATION' as check_type,
  u.email,
  u.id as user_uuid,
  ur.role,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email CONFIRMED'
    ELSE '❌ Email NOT CONFIRMED'
  END as email_status,
  '✅ Setup COMPLETE' as status
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@drkabiruscholarship.com' AND ur.role = 'admin';
```

## ✅ **Verification Steps**

After running the fix:

1. **Check the final verification output** - should show:
   - ✅ Email CONFIRMED
   - ✅ Setup COMPLETE

2. **Test login immediately:**
   - Go to: `https://your-vercel-url.vercel.app/admin`
   - Use credentials:
     ```
     Email: admin@drkabiruscholarship.com
     Password: DrKabiru2025!Admin
     ```

3. **Expected result:**
   - Should redirect to `/admin/dashboard`
   - Should see admin interface with statistics

## 🚨 **If Still Not Working**

### **Browser Issues:**
1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Try incognito/private mode**
3. **Check browser console** (F12) for errors

### **Environment Issues:**
1. **Verify Vercel environment variables:**
   - `VITE_SUPABASE_URL`: `https://tpwvsbvlgmdebvhmmoub.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: (your anon key)

2. **Redeploy on Vercel** to ensure latest code

### **Database Connection Issues:**
1. **Check Supabase project status** (should be green/active)
2. **Test with a simple query** in SQL Editor
3. **Verify RLS policies** aren't blocking access

## 📞 **Next Steps**

1. **Run the diagnostic SQL first**
2. **Follow the appropriate fix based on results**
3. **Run the complete fix SQL**
4. **Test login immediately**
5. **Report back with specific error messages if still failing**

The most common issue is that the admin user exists but the UUID in the user_roles table doesn't match the actual user UUID from auth.users. The fix SQL will correct this automatically.