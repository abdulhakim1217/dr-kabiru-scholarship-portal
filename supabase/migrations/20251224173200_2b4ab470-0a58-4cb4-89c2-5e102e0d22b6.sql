-- Add community_name column to scholarship_applications
ALTER TABLE public.scholarship_applications 
ADD COLUMN community_name text NOT NULL DEFAULT '';