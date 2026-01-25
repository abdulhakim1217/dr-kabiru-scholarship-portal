// Admin Setup Script
// Run this script to create the admin user
// Usage: node setup-admin.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tpwvsbvlgmdebvhmmoub.supabase.co';
const SUPABASE_SERVICE_KEY = 'YOUR_SERVICE_ROLE_KEY_HERE'; // You need to get this from Supabase dashboard

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  const adminEmail = 'admin@drkabiruscholarship.com';
  const adminPassword = 'DrKabiru2025!Admin';
  
  try {
    console.log('Creating admin user...');
    
    // Create the user
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });
    
    if (userError) {
      console.error('Error creating user:', userError);
      return;
    }
    
    console.log('User created successfully:', user.user.id);
    
    // Add admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: user.user.id,
        role: 'admin'
      });
    
    if (roleError) {
      console.error('Error adding admin role:', roleError);
      return;
    }
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🌐 Login URL: https://yoursite.com/admin');
    
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

createAdminUser();