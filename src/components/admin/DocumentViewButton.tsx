import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentViewButtonProps {
  url: string | null;
  label: string;
}

export const DocumentViewButton = ({ url, label }: DocumentViewButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  if (!url) return null;

  const handleViewDocument = async () => {
    setIsLoading(true);
    try {
      // Extract the file path from the URL
      // URLs are typically in format: .../scholarship-documents/filename
      const bucketName = "scholarship-documents";
      let filePath = url;

      // If it's a full URL, extract just the path after the bucket name
      if (url.includes(bucketName)) {
        const parts = url.split(bucketName + "/");
        if (parts.length > 1) {
          filePath = parts[1].split("?")[0]; // Remove any query params
        }
      }

      // Generate a signed URL that expires in 1 hour
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 3600);

      if (error) throw error;

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Error generating signed URL:", error);
      toast({
        title: "Error",
        description: "Failed to open document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleViewDocument}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4 mr-1" />
      )}
      {label}
    </Button>
  );
};
