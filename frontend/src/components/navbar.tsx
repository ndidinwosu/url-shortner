import { Crown, LogOut } from "lucide-react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import { Button } from "./ui/button";
import { useTheme } from "../contexts/theme-context";
import { MobileNav } from "./layout/MobileNav";

export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const NavLinks = () => (
    <>
      <RouterLink
        to="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === "/" ? "text-primary" : "text-foreground/80"
        }`}
      >
        Shorten URL
      </RouterLink>
      <RouterLink
        to="/dashboard"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          location.pathname === "/dashboard"
            ? "text-primary"
            : "text-foreground/80"
        }`}
      >
        Dashboard
      </RouterLink>
    </>
  );

  return (
    <header className="sticky top-0 z-[99] w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <RouterLink to="/" className="mr-6 flex items-center space-x-2">
            <Crown className="h-6 w-6 text-primary" data-testid="crown-icon" />
            <span className="font-bold text-xl text-foreground">ShortKing</span>
          </RouterLink>
        </div>

        {/* Desktop navigation */}
        {isAuthenticated && (
          <nav className="hidden lg:flex flex-1 items-center gap-6 text-sm">
            <NavLinks />
          </nav>
        )}

        <div className="ml-auto flex items-center gap-4">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className="text-foreground/80 hover:text-primary"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </Button>

          {/* Mobile navigation */}
          {isAuthenticated && (
            <MobileNav>
              <div className="flex flex-col gap-6 py-4">
                <NavLinks />
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-foreground/80 hover:text-primary flex items-center gap-2 justify-start w-auto"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </MobileNav>
          )}

          {/* Desktop authentication button */}
          <div className="hidden lg:block">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-foreground/80 hover:text-primary flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <RouterLink
                to="/login"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-4 py-2"
              >
                Login
              </RouterLink>
            )}
          </div>

          {/* Mobile login button (when not authenticated) */}
          {!isAuthenticated && (
            <div className="lg:hidden">
              <RouterLink
                to="/login"
                className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-4 py-2"
              >
                Login
              </RouterLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
