import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { WebRiskResponse } from "../lib/api";
import {
  Loader2,
  Copy,
  ExternalLink,
  AlertTriangle,
  Download,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useUrls } from "../hooks/useUrls";
import { useAuth } from "../contexts/auth-context";
import { QRCodeSVG } from "qrcode.react";

export function URLShortenerForm() {
  const { isAuthenticated } = useAuth();
  const { shortenUrl, checkUrlSafety } = useUrls();
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");
  // QR code ref for download functionality
  const qrCodeRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlThreat, setUrlThreat] = useState<WebRiskResponse["threat"] | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShortenedUrl("");
    setUrlThreat(null);

    try {
      setIsCheckingUrl(true);
      const safetyCheck = await checkUrlSafety(url);
      setIsCheckingUrl(false);

      if (safetyCheck.threat) {
        setUrlThreat(safetyCheck.threat);
        setIsLoading(false);
        return;
      }

      const result = await shortenUrl({
        url,
        ...(customAlias && { custom_alias: customAlias }),
        ...(expiresIn && { expires_in: parseInt(expiresIn) }),
      });

      setShortenedUrl(result.shortUrl);
    } catch (error: unknown) {
      setError("Failed to shorten URL. Please try again.");
      console.error("Error shortening URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error: unknown) {
      console.error("Failed to copy:", error);
    }
  };

  // Function to download QR code
  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;

    try {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const svg = qrCodeRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      // Create a data URL from the SVG
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const URL = window.URL || window.webkitURL || window;
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Set canvas dimensions to match QR code with some padding
        canvas.width = img.width + 40; // 20px padding on each side
        canvas.height = img.height + 40;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill with white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image centered
        ctx.drawImage(img, 20, 20);

        // Convert to data URL and trigger download
        const dataUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.download = "qrcode.png";
        a.href = dataUrl;
        a.click();

        // Clean up
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  return (
    <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <Card className="p-4 sm:p-6 border-border/10 bg-card hover:bg-card/90 transition-colors shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="url"
              className="text-foreground text-sm sm:text-base"
            >
              Enter your long URL
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-2 sm:gap-4">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary bg-background text-foreground min-h-[44px]"
              />
              <Button
                type="submit"
                disabled={isLoading || isCheckingUrl}
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full min-h-[44px]"
              >
                {isLoading || isCheckingUrl ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span className="truncate">
                      {isCheckingUrl ? "Checking..." : "Shortening..."}
                    </span>
                  </>
                ) : (
                  "Shorten URL"
                )}
              </Button>
            </div>
          </div>

          {isAuthenticated && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label
                  htmlFor="customAlias"
                  className="text-foreground text-sm"
                >
                  Custom Alias (Optional)
                </Label>
                <Input
                  id="customAlias"
                  type="text"
                  placeholder="my-custom-url"
                  value={customAlias}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCustomAlias(e.target.value)
                  }
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary bg-background text-foreground min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresIn" className="text-foreground text-sm">
                  Time to Live (hours, Optional)
                </Label>
                <Input
                  id="expiresIn"
                  type="number"
                  placeholder="24"
                  value={expiresIn}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setExpiresIn(e.target.value)
                  }
                  min="1"
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary bg-background text-foreground min-h-[44px]"
                />
              </div>
            </div>
          )}
        </form>
      </Card>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm sm:text-base">
          {error}
        </div>
      )}

      {urlThreat && (
        <Card className="overflow-hidden border-destructive/30 bg-destructive/10 shadow-xl">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-semibold text-destructive">
                  Unsafe URL Detected
                </h3>
                <p className="text-xs sm:text-sm text-destructive/90">
                  This URL has been identified as potentially harmful. <br />
                  Threat types: {urlThreat.threatTypes.join(", ")}
                </p>
                <p className="text-xs sm:text-sm text-destructive/90">
                  We cannot shorten this URL. Please try a different URL.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {shortenedUrl && (
        <Card className="overflow-hidden border-border/10 bg-card hover:bg-card/90 transition-colors shadow-xl">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-primary">
                  Your Shortened URL
                </h3>
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-background/50 rounded-lg">
                  <span
                    data-testid="shortened-url"
                    className="flex-1 font-mono text-xs sm:text-sm break-all text-foreground"
                  >
                    {shortenedUrl}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="shrink-0 text-foreground hover:text-primary min-h-[44px] min-w-[44px]"
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy URL</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => window.open(shortenedUrl, "_blank")}
                    className="shrink-0 text-foreground hover:text-primary min-h-[44px] min-w-[44px]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open URL</span>
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs sm:text-sm text-primary">
                    Copied to clipboard!
                  </p>
                )}
              </div>

              {/* QR Code section - now available for all users */}
              <div className="flex flex-col items-center gap-2 mt-4 md:mt-0">
                <h3 className="text-base sm:text-lg font-semibold text-primary">
                  QR Code
                </h3>
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg">
                  <QRCodeSVG
                    ref={qrCodeRef}
                    value={shortenedUrl}
                    size={100}
                    className="w-24 h-24 sm:w-32 sm:h-32"
                    bgColor={"#FFFFFF"}
                    fgColor={"#000000"}
                    level={"H"}
                    includeMargin={true}
                    data-testid="qr-code"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQRCode}
                  className="rounded-full border-primary text-primary hover:bg-primary/10 flex items-center gap-1 text-xs sm:text-sm min-h-[38px]"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  Download QR Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
