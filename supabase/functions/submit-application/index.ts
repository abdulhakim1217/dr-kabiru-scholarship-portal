import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]
const RATE_LIMIT_WINDOW_MINUTES = 60
const MAX_SUBMISSIONS_PER_WINDOW = 3

interface ApplicationData {
  fullName: string
  email: string
  phone: string
  communityName: string
  university: string
  course: string
  yearOfStudy: string
  cgpa: string
  reason: string
}

function validateInput(data: ApplicationData): { valid: boolean; error?: string } {
  // Validate required fields
  const requiredFields = ['fullName', 'email', 'phone', 'communityName', 'university', 'course', 'yearOfStudy', 'cgpa', 'reason']
  for (const field of requiredFields) {
    if (!data[field as keyof ApplicationData] || data[field as keyof ApplicationData].trim() === '') {
      return { valid: false, error: `${field} is required` }
    }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Invalid email format' }
  }

  // Validate field lengths
  if (data.fullName.length > 200) return { valid: false, error: 'Full name too long' }
  if (data.email.length > 255) return { valid: false, error: 'Email too long' }
  if (data.phone.length > 20) return { valid: false, error: 'Phone number too long' }
  if (data.communityName.length > 100) return { valid: false, error: 'Community name too long' }
  if (data.university.length > 200) return { valid: false, error: 'University name too long' }
  if (data.course.length > 200) return { valid: false, error: 'Course name too long' }
  if (data.reason.length > 5000) return { valid: false, error: 'Reason too long' }

  return { valid: true }
}

function validateFile(file: { name: string; type: string; size: number }): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File ${file.name} exceeds 10MB limit` }
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: `File ${file.name} has invalid type. Allowed: PDF, Word, JPEG, PNG` }
  }
  return { valid: true }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

    console.log(`Submission attempt from IP: ${clientIP}`)

    // Check rate limit
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000).toISOString()
    
    const { data: rateData } = await supabase
      .from('submission_rate_limits')
      .select('*')
      .eq('ip_address', clientIP)
      .gte('window_start', windowStart)
      .single()

    if (rateData && rateData.submission_count >= MAX_SUBMISSIONS_PER_WINDOW) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)
      return new Response(
        JSON.stringify({ 
          error: 'Too many submissions. Please wait before trying again.',
          retryAfter: RATE_LIMIT_WINDOW_MINUTES 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse multipart form data
    const formData = await req.formData()
    
    // Extract and validate application data
    const applicationData: ApplicationData = {
      fullName: formData.get('fullName') as string || '',
      email: formData.get('email') as string || '',
      phone: formData.get('phone') as string || '',
      communityName: formData.get('communityName') as string || '',
      university: formData.get('university') as string || '',
      course: formData.get('course') as string || '',
      yearOfStudy: formData.get('yearOfStudy') as string || '',
      cgpa: formData.get('cgpa') as string || '',
      reason: formData.get('reason') as string || '',
    }

    const inputValidation = validateInput(applicationData)
    if (!inputValidation.valid) {
      console.log(`Input validation failed: ${inputValidation.error}`)
      return new Response(
        JSON.stringify({ error: inputValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Process files
    const files = {
      transcript: formData.get('transcript') as File | null,
      applicationLetter: formData.get('applicationLetter') as File | null,
      nominationLetter: formData.get('nominationLetter') as File | null,
      supportingDocs: formData.get('supportingDocs') as File | null,
    }

    // Validate required files
    if (!files.transcript) {
      return new Response(
        JSON.stringify({ error: 'Academic transcript is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!files.applicationLetter) {
      return new Response(
        JSON.stringify({ error: 'Application letter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    if (!files.nominationLetter) {
      return new Response(
        JSON.stringify({ error: 'Nomination letter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate all files
    for (const [key, file] of Object.entries(files)) {
      if (file) {
        const fileValidation = validateFile({ 
          name: file.name, 
          type: file.type, 
          size: file.size 
        })
        if (!fileValidation.valid) {
          console.log(`File validation failed for ${key}: ${fileValidation.error}`)
          return new Response(
            JSON.stringify({ error: fileValidation.error }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }

    // Upload files to storage
    const uploadFile = async (file: File, folder: string): Promise<string> => {
      const fileExt = file.name.split('.').pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const arrayBuffer = await file.arrayBuffer()
      
      const { data, error } = await supabase.storage
        .from('scholarship-documents')
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
        })

      if (error) {
        console.error(`Upload error for ${folder}:`, error)
        throw new Error(`Failed to upload ${folder}`)
      }

      return data.path
    }

    console.log('Uploading files...')
    
    const transcriptUrl = await uploadFile(files.transcript, 'transcripts')
    const applicationLetterUrl = await uploadFile(files.applicationLetter, 'application-letters')
    const nominationLetterUrl = await uploadFile(files.nominationLetter, 'nomination-letters')
    const supportingDocsUrl = files.supportingDocs 
      ? await uploadFile(files.supportingDocs, 'supporting-docs') 
      : null

    console.log('Files uploaded successfully')

    // Insert application
    const { error: insertError } = await supabase
      .from('scholarship_applications')
      .insert({
        full_name: applicationData.fullName.trim(),
        email: applicationData.email.trim().toLowerCase(),
        phone: applicationData.phone.trim(),
        community_name: applicationData.communityName.trim(),
        university: applicationData.university.trim(),
        course: applicationData.course.trim(),
        year_of_study: applicationData.yearOfStudy,
        cgpa: applicationData.cgpa.trim(),
        reason: applicationData.reason.trim(),
        transcript_url: transcriptUrl,
        application_letter_url: applicationLetterUrl,
        nomination_letter_url: nominationLetterUrl,
        supporting_docs_url: supportingDocsUrl,
      })

    if (insertError) {
      console.error('Insert error:', insertError)
      throw new Error('Failed to save application')
    }

    console.log('Application saved successfully')

    // Update rate limit
    if (rateData) {
      await supabase
        .from('submission_rate_limits')
        .update({ submission_count: rateData.submission_count + 1 })
        .eq('id', rateData.id)
    } else {
      await supabase
        .from('submission_rate_limits')
        .insert({ ip_address: clientIP, submission_count: 1, window_start: new Date().toISOString() })
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Application submitted successfully' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    console.error('Submission error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit application'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
