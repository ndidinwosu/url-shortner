import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="text-center">
        <LoadingSpinner className="w-8 h-8" />
        <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
