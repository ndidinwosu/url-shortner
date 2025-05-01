import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { GoogleLogin } from "@react-oauth/google";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { ErrorPopup } from "../ErrorPopup"; 
import { useErrorPopup } from "../../hooks/useErrorPopup"; 



export function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();
  const { register, googleLogin, error: authError } = useAuth();

  const { isOpen, error: popupError, showError, hideError } = useErrorPopup();


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError("");

    if (password.length < 8) {
      const errorMsg = "Password must be at least 8 characters long";
      setLocalError(errorMsg);
      showError(errorMsg);
      setIsLoading(false);
      return;
    }

    // 驗證密碼
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({ email, password });
      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
      console.error("Registration failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const success = await googleLogin({
        credential: credentialResponse.credential,
      });
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google Sign-Up failed:", error);
      setLocalError("Google Sign-Up failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    setLocalError("Google Sign-Up failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary/90">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-foreground bg-background"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-foreground bg-background"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-input px-3 py-2 text-foreground bg-background"
                placeholder="••••••••"
              />
            </div>
          </div>

          {(localError || authError) && (
            <div className="text-red-500 text-sm" role="alert">
              {localError || authError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? (
              <LoadingSpinner data-testid="loading-spinner" />
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              data-testid="google-signup"
            />
          </div>
        </div>
      </div>

      <ErrorPopup
        isOpen={isOpen}
        error={popupError}
        onClose={hideError}
      />
    </div>
  );
}
