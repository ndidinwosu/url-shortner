import { useState } from "react";
import { mockQRTemplates } from "../mock-data";

interface QRTemplate {
  id: string;
  name: string;
  backgroundColor: string;
  foregroundColor: string;
  cornerSquareStyle: string;
  cornerDotStyle: string;
}

export function useQRCode() {
  const [templates, setTemplates] = useState<QRTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTemplates(mockQRTemplates);
    } catch (err) {
      setError("Failed to fetch QR templates");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCode = async (url: string, templateId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Mock QR code data URL
      return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;
    } catch (err) {
      setError("Failed to generate QR code");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    templates,
    isLoading,
    error,
    fetchTemplates,
    generateQRCode,
  };
}
