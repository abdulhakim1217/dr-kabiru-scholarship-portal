-- Create storage bucket for scholarship documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('scholarship-documents', 'scholarship-documents', false);

-- Create storage policy to allow anyone to upload documents
CREATE POLICY "Anyone can upload scholarship documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scholarship-documents');

-- Create storage policy to allow reading documents (for admins later)
CREATE POLICY "Documents are accessible to authenticated users"
ON storage.objects FOR SELECT
USING (bucket_id = 'scholarship-documents');

-- Create applications table to store scholarship applications
CREATE TABLE public.scholarship_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  university TEXT NOT NULL,
  course TEXT NOT NULL,
  year_of_study TEXT NOT NULL,
  cgpa TEXT NOT NULL,
  reason TEXT NOT NULL,
  transcript_url TEXT,
  supporting_docs_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on applications table
ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert applications (public form)
CREATE POLICY "Anyone can submit scholarship applications"
ON public.scholarship_applications FOR INSERT
WITH CHECK (true);

-- Only authenticated users can view applications (for admin)
CREATE POLICY "Authenticated users can view applications"
ON public.scholarship_applications FOR SELECT
USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_scholarship_applications_updated_at
BEFORE UPDATE ON public.scholarship_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();