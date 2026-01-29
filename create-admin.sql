-- Manual Admin Setup
-- Copy and paste this into your Supabase SQL Editor

-- 1. First, create the admin user via Supabase Auth Dashboard
-- Go to Authentication > Users > Add User
-- Email: admin@drkabiruscholarship.com
-- Password: DrKabiru2025!Admin
-- Then copy the user UUID and replace USER_UUID_HERE below

-- 2. Run this SQL to add admin role (replace USER_UUID_HERE with actual UUID)
INSERT INTO public.user_roles (user_id, role)
VALUES ('22d19fab-8579-4f84-a9e2-0351bc6000e1', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 3. Verify the admin user was created
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';