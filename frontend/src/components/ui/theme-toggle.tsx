import { Crown, User } from "lucide-react";
import { Button } from "./button";
import { useTheme } from "../../contexts/theme-context";

export function ThemeToggle() {
  const { isPaidVersion, toggleVersion } = useTheme();

  return (
    <Button
      variant="outline"
      onClick={toggleVersion}
      className="relative flex items-center gap-2"
    >
      {isPaidVersion ? (
        <>
          <Crown className="h-4 w-4 text-yellow-500" />
          <span>Premium</span>
        </>
      ) : (
        <>
          <User className="h-4 w-4" />
          <span>Free</span>
        </>
      )}
    </Button>
  );
}
