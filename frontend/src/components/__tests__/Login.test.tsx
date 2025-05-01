import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Login } from "../Login";
import * as authContext from "../../contexts/auth-context";
import * as themeContext from "../../contexts/theme-context";
import { BrowserRouter } from "react-router-dom";

// Navigation mock
const mockNavigate = vi.fn();

// Auth context mock
const mockLogin = vi.fn();
const mockGoogleLogin = vi.fn();

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Google OAuth components
vi.mock("@react-oauth/google", () => ({
  GoogleLogin: ({
    onSuccess,
    onError,
  }: {
    onSuccess: (response: { credential: string }) => void;
    onError: () => void;
  }) => (
    <button
      data-testid="google-login"
      onClick={() => onSuccess({ credential: "mock-credential" })}
    >
      Sign in with Google
    </button>
  ),
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock useErrorPopup hook
vi.mock("../../hooks/useErrorPopup", () => ({
  useErrorPopup: () => ({
    isOpen: false,
    error: null,
    showError: vi.fn(),
    hideError: vi.fn(),
  }),
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default successful login
    mockLogin.mockResolvedValue(true);
    mockGoogleLogin.mockResolvedValue(true);

    // Mock theme hook
    vi.spyOn(themeContext, "useTheme").mockReturnValue({
      theme: "light",
      toggleTheme: vi.fn(),
    });

    // Mock auth context
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      login: mockLogin,
      googleLogin: mockGoogleLogin,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      register: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Custom render function for Login component
  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
  };

  // Helper function to get the submit button
  const getSubmitButton = () => {
    return screen.getByRole("button", { name: /^sign in$/i });
  };

  it("renders the login form correctly", () => {
    renderLogin();

    // Check form elements
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Find the submit button
    const submitButton = getSubmitButton();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent("Sign in");

    expect(screen.getByTestId("google-login")).toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    renderLogin();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Submit the form by targeting the submit button directly
    fireEvent.click(getSubmitButton());

    // Check if login function was called with correct arguments
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("shows loading state during form submission", async () => {
    // Mock login to delay
    mockLogin.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
    );

    // Mock auth loading state
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      login: mockLogin,
      googleLogin: mockGoogleLogin,
      isLoading: true,
      error: null,
      isAuthenticated: false,
      register: vi.fn(),
      logout: vi.fn(),
    });

    renderLogin();

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    // Get the submit button and click it
    fireEvent.click(getSubmitButton());

    // Check loading state
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("displays error message when login fails", async () => {
    // Mock login failure
    const errorMessage = "Invalid credentials";
    mockLogin.mockRejectedValue({
      response: { data: { detail: errorMessage } },
    });

    renderLogin();

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrong-password" },
    });

    // Get the submit button and click it
    fireEvent.click(getSubmitButton());

    // Check if error message is displayed using text content
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Navigation should not have been called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles Google sign-in correctly", async () => {
    renderLogin();

    // Click Google login button
    fireEvent.click(screen.getByTestId("google-login"));

    // Check if googleLogin was called with credential
    await waitFor(() => {
      expect(mockGoogleLogin).toHaveBeenCalledWith({
        credential: "mock-credential",
      });
    });

    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("displays error message when Google sign-in fails", async () => {
    // Mock Google login failure
    mockGoogleLogin.mockRejectedValue(
      new Error("Google authentication failed")
    );

    renderLogin();

    // Click Google login button
    fireEvent.click(screen.getByTestId("google-login"));

    // Check for error message with text content
    await waitFor(() => {
      expect(screen.getByText(/google sign-in failed/i)).toBeInTheDocument();
    });

    // Navigation should not have been called
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
