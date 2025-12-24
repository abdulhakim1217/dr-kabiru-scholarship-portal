import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Upload, FileText, X, Loader2 } from "lucide-react";

interface FileUpload {
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ApplicationForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  
  // File refs
  const transcriptInputRef = useRef<HTMLInputElement>(null);
  const applicationLetterInputRef = useRef<HTMLInputElement>(null);
  const nominationLetterInputRef = useRef<HTMLInputElement>(null);
  const supportingDocsInputRef = useRef<HTMLInputElement>(null);

  // File states
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [applicationLetterFile, setApplicationLetterFile] = useState<File | null>(null);
  const [nominationLetterFile, setNominationLetterFile] = useState<File | null>(null);
  const [supportingDocsFile, setSupportingDocsFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    communityName: "",
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

  const validateFile = (file: File): boolean => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return false;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, Word document, or image file",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleFileChange = (type: 'transcript' | 'applicationLetter' | 'nominationLetter' | 'supportingDocs') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      switch (type) {
        case 'transcript':
          setTranscriptFile(file);
          break;
        case 'applicationLetter':
          setApplicationLetterFile(file);
          break;
        case 'nominationLetter':
          setNominationLetterFile(file);
          break;
        case 'supportingDocs':
          setSupportingDocsFile(file);
          break;
      }
    }
  };

  const removeFile = (type: 'transcript' | 'applicationLetter' | 'nominationLetter' | 'supportingDocs') => {
    switch (type) {
      case 'transcript':
        setTranscriptFile(null);
        if (transcriptInputRef.current) transcriptInputRef.current.value = '';
        break;
      case 'applicationLetter':
        setApplicationLetterFile(null);
        if (applicationLetterInputRef.current) applicationLetterInputRef.current.value = '';
        break;
      case 'nominationLetter':
        setNominationLetterFile(null);
        if (nominationLetterInputRef.current) nominationLetterInputRef.current.value = '';
        break;
      case 'supportingDocs':
        setSupportingDocsFile(null);
        if (supportingDocsInputRef.current) supportingDocsInputRef.current.value = '';
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!transcriptFile || !applicationLetterFile || !nominationLetterFile) {
      toast({
        title: "Missing Required Documents",
        description: "Please upload all required documents: transcript, application letter, and nomination letter.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress("Submitting application...");
    
    try {
      // Build form data for edge function
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('communityName', formData.communityName);
      submitData.append('university', formData.university);
      submitData.append('course', formData.course);
      submitData.append('yearOfStudy', formData.yearOfStudy);
      submitData.append('cgpa', formData.cgpa);
      submitData.append('reason', formData.reason);
      submitData.append('transcript', transcriptFile);
      submitData.append('applicationLetter', applicationLetterFile);
      submitData.append('nominationLetter', nominationLetterFile);
      if (supportingDocsFile) {
        submitData.append('supportingDocs', supportingDocsFile);
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-application`,
        {
          method: 'POST',
          body: submitData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many submissions. Please wait an hour before trying again.');
        }
        throw new Error(result.error || 'Failed to submit application');
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
        communityName: "",
        university: "",
        course: "",
        yearOfStudy: "",
        cgpa: "",
        reason: "",
      });
      setTranscriptFile(null);
      setApplicationLetterFile(null);
      setNominationLetterFile(null);
      setSupportingDocsFile(null);
      if (transcriptInputRef.current) transcriptInputRef.current.value = '';
      if (applicationLetterInputRef.current) applicationLetterInputRef.current.value = '';
      if (nominationLetterInputRef.current) nominationLetterInputRef.current.value = '';
      if (supportingDocsInputRef.current) supportingDocsInputRef.current.value = '';
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress("");
    }
  };

  const FileUploadField = ({ 
    label, 
    file, 
    inputRef, 
    type, 
    required = false 
  }: { 
    label: string; 
    file: File | null; 
    inputRef: React.RefObject<HTMLInputElement>; 
    type: 'transcript' | 'applicationLetter' | 'nominationLetter' | 'supportingDocs';
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label>{label} {required && '*'}</Label>
      <div className="flex items-center gap-4">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange(type)}
          className="hidden"
        />
        {!file ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="border-2 shadow-xs hover:shadow-sm transition-shadow"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-background border-2 border-border flex-1">
            <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate flex-1">{file.name}</span>
            <button
              type="button"
              onClick={() => removeFile(type)}
              className="p-1 hover:bg-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

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
                  placeholder="+233 XXX XXX XXXX"
                  required
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="communityName">Community Name (within Walewale) *</Label>
                <Input
                  id="communityName"
                  name="communityName"
                  value={formData.communityName}
                  onChange={handleInputChange}
                  placeholder="e.g., Walewale, Wungu, Nasia"
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
                <h3 className="font-bold text-lg mb-2">Required Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your documents in PDF, Word, or image format (max 10MB each)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FileUploadField
                  label="Academic Transcript"
                  file={transcriptFile}
                  inputRef={transcriptInputRef}
                  type="transcript"
                  required
                />
                
                <FileUploadField
                  label="Application Letter"
                  file={applicationLetterFile}
                  inputRef={applicationLetterInputRef}
                  type="applicationLetter"
                  required
                />
                
                <FileUploadField
                  label="Nomination Letter"
                  file={nominationLetterFile}
                  inputRef={nominationLetterInputRef}
                  type="nominationLetter"
                  required
                />
                
                <FileUploadField
                  label="Other Supporting Documents"
                  file={supportingDocsFile}
                  inputRef={supportingDocsInputRef}
                  type="supportingDocs"
                />
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
                  {uploadProgress || "Submitting..."}
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
