-- Create rate limiting table
CREATE TABLE public.submission_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  submission_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_rate_limits_ip ON public.submission_rate_limits(ip_address);

-- Enable RLS
ALTER TABLE public.submission_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage rate limits (edge functions use service role)
CREATE POLICY "Service role can manage rate limits"
ON public.submission_rate_limits
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Update storage policies: remove anonymous upload, only allow via service role
DROP POLICY IF EXISTS "Anyone can upload scholarship documents" ON storage.objects;

CREATE POLICY "Service role can upload scholarship documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'scholarship-documents' 
  AND auth.role() = 'service_role'
);

CREATE POLICY "Service role can read scholarship documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'scholarship-documents' 
  AND auth.role() = 'service_role'
);

-- Update application insert policy: only via service role
DROP POLICY IF EXISTS "Anyone can submit scholarship applications" ON public.scholarship_applications;

CREATE POLICY "Service role can submit applications"
ON public.scholarship_applications FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Create admin roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check if user has a role
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Update SELECT policy: only admins can view applications
DROP POLICY IF EXISTS "Authenticated users can view applications" ON public.scholarship_applications;

CREATE POLICY "Admins can view applications"
ON public.scholarship_applications FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update application status
CREATE POLICY "Admins can update applications"
ON public.scholarship_applications FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);