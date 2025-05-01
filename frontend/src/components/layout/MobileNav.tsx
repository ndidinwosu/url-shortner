import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";

interface MobileNavProps {
  children: React.ReactNode;
}

export function MobileNav({ children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative z-[100]"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 top-0 left-0 right-0 bottom-0 z-[90] bg-background/95 backdrop-blur-sm overflow-y-auto"
          style={{ position: "fixed", width: "100vw", height: "100vh" }}
        >
          <div className="min-h-screen container flex flex-col gap-6 p-6 pt-20">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
