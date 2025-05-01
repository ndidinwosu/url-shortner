import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 8, className }: LoadingSpinnerProps) {
  return (
    <Loader2
      data-testid="loading-spinner"
      className={cn(`h-${size} w-${size} animate-spin`, className)}
    />
  );
}
