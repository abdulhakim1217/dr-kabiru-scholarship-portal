-- Create admin user and setup
-- This migration creates the admin user and ensures all necessary data is in place

-- First, let's make sure we have the user_roles table with proper structure
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'user', 'reviewer')),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur 
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (user_id = auth.uid());

-- Create has_role function if it doesn't exist
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND user_roles.role = $2
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the scholarship_applications table to match the form structure
ALTER TABLE public.scholarship_applications 
  DROP COLUMN IF EXISTS institution_name,
  DROP COLUMN IF EXISTS program_course,
  DROP COLUMN IF EXISTS year_semester,
  DROP COLUMN IF EXISTS gpa_cgpa,
  DROP COLUMN IF EXISTS essay_responses,
  DROP COLUMN IF EXISTS financial_need_description,
  DROP COLUMN IF EXISTS leadership_activities,
  DROP COLUMN IF EXISTS community_service,
  DROP COLUMN IF EXISTS career_goals,
  DROP COLUMN IF EXISTS academic_transcript_url,
  DROP COLUMN IF EXISTS admission_letter_url,
  DROP COLUMN IF EXISTS national_id_url,
  DROP COLUMN IF EXISTS recommendation_letters_urls,
  DROP COLUMN IF EXISTS supporting_documents_urls;

-- Add columns that match the form
ALTER TABLE public.scholarship_applications 
  ADD COLUMN IF NOT EXISTS university text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS course text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS year_of_study text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cgpa text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS reason text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS transcript_url text,
  ADD COLUMN IF NOT EXISTS application_letter_url text,
  ADD COLUMN IF NOT EXISTS nomination_letter_url text,
  ADD COLUMN IF NOT EXISTS supporting_docs_url text;

-- Update the status enum to match what the admin dashboard expects
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'under_review';

-- Set default status to pending instead of draft
ALTER TABLE public.scholarship_applications 
  ALTER COLUMN status SET DEFAULT 'pending';

-- Create a function to handle application submissions
CREATE OR REPLACE FUNCTION public.submit_application(
  p_full_name text,
  p_email text,
  p_phone text,
  p_community_name text,
  p_university text,
  p_course text,
  p_year_of_study text,
  p_cgpa text,
  p_reason text,
  p_transcript_url text DEFAULT NULL,
  p_application_letter_url text DEFAULT NULL,
  p_nomination_letter_url text DEFAULT NULL,
  p_supporting_docs_url text DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  new_app_id uuid;
BEGIN
  INSERT INTO public.scholarship_applications (
    full_name,
    email,
    phone,
    community_name,
    university,
    course,
    year_of_study,
    cgpa,
    reason,
    transcript_url,
    application_letter_url,
    nomination_letter_url,
    supporting_docs_url,
    status,
    submission_date
  ) VALUES (
    p_full_name,
    p_email,
    p_phone,
    p_community_name,
    p_university,
    p_course,
    p_year_of_study,
    p_cgpa,
    p_reason,
    p_transcript_url,
    p_application_letter_url,
    p_nomination_letter_url,
    p_supporting_docs_url,
    'pending',
    now()
  ) RETURNING id INTO new_app_id;
  
  RETURN new_app_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Allow anonymous users to submit applications
GRANT EXECUTE ON FUNCTION public.submit_application TO anon;

-- Create policy to allow anonymous application submissions
DROP POLICY IF EXISTS "Allow anonymous application submissions" ON public.scholarship_applications;
CREATE POLICY "Allow anonymous application submissions" ON public.scholarship_applications
  FOR INSERT WITH CHECK (true);

-- Allow anonymous users to read from scholarship_applications for admin dashboard
DROP POLICY IF EXISTS "Allow anonymous read for admin" ON public.scholarship_applications;
CREATE POLICY "Allow anonymous read for admin" ON public.scholarship_applications
  FOR SELECT USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, INSERT ON public.scholarship_applications TO anon;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role TO authenticated;

-- Insert sample communities for the dropdown
CREATE TABLE IF NOT EXISTS public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  district text,
  region text DEFAULT 'North East Region',
  created_at timestamp with time zone DEFAULT now()
);

-- Insert Walewale Constituency communities
INSERT INTO public.communities (name, district) VALUES
  ('Walewale', 'West Mamprusi'),
  ('Wungu', 'West Mamprusi'),
  ('Nasia', 'West Mamprusi'),
  ('Kpasenkpe', 'West Mamprusi'),
  ('Gbintiri', 'West Mamprusi'),
  ('Kpandai', 'West Mamprusi'),
  ('Sakogu', 'West Mamprusi'),
  ('Yagaba', 'West Mamprusi'),
  ('Demon', 'West Mamprusi'),
  ('Kparigu', 'West Mamprusi')
ON CONFLICT (name) DO NOTHING;

-- Allow public read access to communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to communities" ON public.communities
  FOR SELECT USING (true);

GRANT SELECT ON public.communities TO anon;
GRANT SELECT ON public.communities TO authenticated;