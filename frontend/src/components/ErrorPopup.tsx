import React, { useEffect } from "react";
import { useTheme } from "../contexts/theme-context";
import { X, AlertCircle } from "lucide-react";

interface ErrorPopupProps {
  isOpen: boolean;
  error: string | null;
  onClose: () => void;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  isOpen,
  error,
  onClose,
}) => {
  const { theme } = useTheme();

  // 按ESC鍵關閉彈出視窗
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // 點擊背景關閉彈出視窗
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full max-w-md rounded-xl border bg-popover text-popover-foreground shadow-lg transform transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-semibold">Error Message</h3>
          </div>
          <button
            className="rounded-full p-1 hover:bg-muted transition-colors"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-foreground/90">{error}</p>
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <button
            className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
