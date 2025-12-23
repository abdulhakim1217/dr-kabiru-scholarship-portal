import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Upload, FileText, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [supportingDocsFile, setSupportingDocsFile] = useState<File | null>(null);
  const [uploadingTranscript, setUploadingTranscript] = useState(false);
  const [uploadingSupportingDocs, setUploadingSupportingDocs] = useState(false);
  
  const transcriptInputRef = useRef<HTMLInputElement>(null);
  const supportingDocsInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    university: "",
    course: "",
    yearOfStudy: "",
    cgpa: "",
    reason: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (type: 'transcript' | 'supportingDocs') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, Word document, or image file",
          variant: "destructive",
        });
        return;
      }
      
      if (type === 'transcript') {
        setTranscriptFile(file);
      } else {
        setSupportingDocsFile(file);
      }
    }
  };

  const removeFile = (type: 'transcript' | 'supportingDocs') => {
    if (type === 'transcript') {
      setTranscriptFile(null);
      if (transcriptInputRef.current) transcriptInputRef.current.value = '';
    } else {
      setSupportingDocsFile(null);
      if (supportingDocsInputRef.current) supportingDocsInputRef.current.value = '';
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('scholarship-documents')
      .upload(fileName, file);

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let transcriptUrl = null;
      let supportingDocsUrl = null;

      // Upload transcript if provided
      if (transcriptFile) {
        setUploadingTranscript(true);
        transcriptUrl = await uploadFile(transcriptFile, 'transcripts');
        setUploadingTranscript(false);
      }

      // Upload supporting documents if provided
      if (supportingDocsFile) {
        setUploadingSupportingDocs(true);
        supportingDocsUrl = await uploadFile(supportingDocsFile, 'supporting-docs');
        setUploadingSupportingDocs(false);
      }

      // Submit application to database
      const { error } = await supabase
        .from('scholarship_applications')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          university: formData.university,
          course: formData.course,
          year_of_study: formData.yearOfStudy,
          cgpa: formData.cgpa,
          reason: formData.reason,
          transcript_url: transcriptUrl,
          supporting_docs_url: supportingDocsUrl,
        });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We will review your application and contact you within 4-6 weeks.",
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        university: "",
        course: "",
        yearOfStudy: "",
        cgpa: "",
        reason: "",
      });
      setTranscriptFile(null);
      setSupportingDocsFile(null);
      if (transcriptInputRef.current) transcriptInputRef.current.value = '';
      if (supportingDocsInputRef.current) supportingDocsInputRef.current.value = '';
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadingTranscript(false);
      setUploadingSupportingDocs(false);
    }
  };

  return (
    <section id="apply" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">
              Start Your Journey
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              APPLY NOW
            </h2>
            <p className="text-lg text-muted-foreground">
              Complete the application form below. Ensure all information is accurate 
              and complete for the best chance of success.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-background border-2 border-border p-8 shadow-md">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 XXX XXX XXXX"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University/Institution *</Label>
                <Input
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="Enter your institution name"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course">Course of Study *</Label>
                <Input
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearOfStudy">Year of Study *</Label>
                <Select 
                  value={formData.yearOfStudy} 
                  onValueChange={(value) => handleSelectChange("yearOfStudy", value)}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 Level</SelectItem>
                    <SelectItem value="200">200 Level</SelectItem>
                    <SelectItem value="300">300 Level</SelectItem>
                    <SelectItem value="400">400 Level</SelectItem>
                    <SelectItem value="500">500 Level</SelectItem>
                    <SelectItem value="postgrad">Postgraduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cgpa">Current CGPA *</Label>
                <Input
                  id="cgpa"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.5"
                  required
                  className="border-2"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="reason">Why do you deserve this scholarship? *</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Tell us about your academic goals, financial situation, and how this scholarship will help you achieve your dreams..."
                rows={6}
                required
                className="border-2 resize-none"
              />
            </div>

            {/* Document Upload Section */}
            <div className="space-y-6 mb-8 p-6 bg-secondary border-2 border-border">
              <div>
                <h3 className="font-bold text-lg mb-2">Supporting Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your academic transcript and any supporting documents (PDF, Word, or images up to 10MB each)
                </p>
              </div>

              {/* Transcript Upload */}
              <div className="space-y-2">
                <Label>Academic Transcript</Label>
                <div className="flex items-center gap-4">
                  <input
                    ref={transcriptInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange('transcript')}
                    className="hidden"
                    id="transcript-upload"
                  />
                  {!transcriptFile ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => transcriptInputRef.current?.click()}
                      className="border-2 shadow-xs hover:shadow-sm transition-shadow"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Transcript
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-background border-2 border-border flex-1">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">{transcriptFile.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile('transcript')}
                        className="p-1 hover:bg-secondary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Supporting Documents Upload */}
              <div className="space-y-2">
                <Label>Other Supporting Documents</Label>
                <div className="flex items-center gap-4">
                  <input
                    ref={supportingDocsInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileChange('supportingDocs')}
                    className="hidden"
                    id="supporting-docs-upload"
                  />
                  {!supportingDocsFile ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => supportingDocsInputRef.current?.click()}
                      className="border-2 shadow-xs hover:shadow-sm transition-shadow"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-background border-2 border-border flex-1">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm truncate flex-1">{supportingDocsFile.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile('supportingDocs')}
                        className="p-1 hover:bg-secondary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="w-full text-lg py-6 shadow-md hover:shadow-lg transition-shadow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {uploadingTranscript ? "Uploading transcript..." : 
                   uploadingSupportingDocs ? "Uploading documents..." : 
                   "Submitting..."}
                </>
              ) : (
                <>
                  Submit Application
                  <Send className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-4">
              By submitting, you agree to our terms and confirm that all information provided is accurate.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ApplicationForm;
