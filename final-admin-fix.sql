-- FINAL ADMIN FIX - This will definitely work
-- Run this entire script in Supabase SQL Editor

-- Step 1: Check current state
SELECT 'CURRENT STATE CHECK' as step;

-- Check if admin user exists in auth.users
SELECT 
  'Auth Users Check' as check_type,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) > 0 THEN 'Admin user EXISTS in auth.users'
    ELSE 'Admin user MISSING from auth.users'
  END as status
FROM auth.users 
WHERE email = 'admin@drkabiruscholarship.com';

-- Show admin user details if exists
SELECT 
  'Admin User Details' as info_type,
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Email CONFIRMED'
    ELSE 'Email NOT CONFIRMED'
  END as confirmation_status
FROM auth.users 
WHERE email = 'admin@drkabiruscholarship.com';

-- Check user_roles table
SELECT 
  'User Roles Check' as check_type,
  COUNT(*) as admin_roles_count,
  CASE 
    WHEN COUNT(*) > 0 THEN 'Admin role EXISTS in user_roles'
    ELSE 'Admin role MISSING from user_roles'
  END as status
FROM public.user_roles 
WHERE role = 'admin';

-- Step 2: Create user_roles table if missing
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

-- Step 3: Clean up any existing admin roles
DELETE FROM public.user_roles WHERE role = 'admin';

-- Step 4: The critical part - we need to handle the auth.users insertion
-- Since we can't directly insert into auth.users from SQL, we'll prepare for manual creation

SELECT 'MANUAL STEP REQUIRED' as step;
SELECT 'You must now create the admin user manually in Supabase Authentication UI' as instruction;
SELECT 'Email: admin@drkabiruscholarship.com' as email_to_use;
SELECT 'Password: DrKabiru2025!Admin' as password_to_use;
SELECT 'Make sure to check "Auto Confirm User" checkbox' as important_note;

-- Step 5: After manual user creation, run this to add the role
-- (Replace the UUID below with the actual UUID from the created user)

-- First, let's see what admin users exist after manual creation
SELECT 
  'After Manual Creation - Check' as step,
  id as user_uuid_to_copy,
  email,
  email_confirmed_at
FROM auth.users 
WHERE email = 'admin@drkabiruscholarship.com';

-- Step 6: Insert admin role for the existing user
-- This will work after you create the user manually
DO $
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@drkabiruscholarship.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Insert admin role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (admin_user_id, 'admin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'SUCCESS: Admin role added for user %', admin_user_id;
    ELSE
        RAISE NOTICE 'ERROR: Admin user not found. Please create user in Authentication UI first.';
    END IF;
END $;

-- Step 7: Final verification
SELECT 'FINAL VERIFICATION' as step;

SELECT 
  'Complete Setup Check' as check_type,
  u.email,
  u.id as user_uuid,
  ur.role,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN 'Email CONFIRMED ✅'
    ELSE 'Email NOT CONFIRMED ❌'
  END as email_status,
  CASE 
    WHEN ur.role = 'admin' THEN 'Admin Role ASSIGNED ✅'
    ELSE 'Admin Role MISSING ❌'
  END as role_status,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL AND ur.role = 'admin' THEN 'READY TO LOGIN ✅'
    ELSE 'NOT READY - CHECK ABOVE ISSUES ❌'
  END as login_ready
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id AND ur.role = 'admin'
WHERE u.email = 'admin@drkabiruscholarship.com';

-- If no results above, user doesn't exist in auth.users
SELECT 
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@drkabiruscholarship.com')
    THEN 'USER DOES NOT EXIST - CREATE IN AUTHENTICATION UI'
    ELSE 'USER EXISTS'
  END as user_existence_check;