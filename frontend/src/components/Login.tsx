import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";
import "../styles/Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useTheme } from "../contexts/theme-context";
import { ErrorPopup } from "./ErrorPopup";
import { useErrorPopup } from "../hooks/useErrorPopup";
import { Container } from "./layout/Container";

// Test user credentials
const TEST_USER = {
  email: "testuser@example.com",
  password: "test1234",
};

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme();
  const {
    login,
    googleLogin,
    isLoading: authLoading,
    error: authError,
  } = useAuth();

  const { isOpen, error: popupError, showError, hideError } = useErrorPopup();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError("");

    try {
      const success = await login({ email, password });
      if (success) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      const err_msg = err.response?.data?.detail;
      showError(
        err_msg ||
          (err instanceof Error
            ? err.message
            : "Login failed. Please try again.")
      );
      // console.log("Login error:", err.response.data.detail);
      setLocalError(
        err_msg ||
          (err instanceof Error
            ? err.message
            : "Login failed. Please try again.")
      );
      console.error("Login failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      console.log("Google Sign-In successful:", credentialResponse);
      // Call googleLogin instead of login, and pass the credential
      const success = await googleLogin({
        credential: credentialResponse.credential,
      });
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google Sign-In failed:", error);
      showError("Google Sign-In failed. Please try again.");
      setLocalError("Google Sign-In failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    showError("Google Sign-In failed. Please try again.");
    setLocalError("Google Sign-In failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 md:py-12">
      <div className="w-full max-w-sm sm:max-w-md space-y-6 sm:space-y-8 p-6 sm:p-8 bg-card border border-border/10 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-primary hover:text-primary/90 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px]"
                placeholder="••••••••"
              />
            </div>
          </div>
          {localError ||
            (authError && (
              <div className="text-red-500 text-sm" role="alert">
                {localError || authError}
              </div>
            ))}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary min-h-[44px]"
          >
            {isLoading ? (
              <LoadingSpinner data-testid="loading-spinner" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="mt-4 sm:mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-foreground/70">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              data-testid="google-login"
              theme={theme === "dark" ? "filled_black" : "outline"}
              shape="pill"
              text="signin_with"
              size="large"
            />
          </div>
        </div>
      </div>
      <ErrorPopup isOpen={isOpen} error={popupError} onClose={hideError} />
    </div>
  );
}
