import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignupPage } from "../SignupPage";
import * as authContext from "../../../contexts/auth-context";
import { TestWrapper } from "../../../test-utils/wrapper";

// Navigation mock
const mockNavigate = vi.fn();

// Auth context mock
const mockRegister = vi.fn();
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
      data-testid="google-signup"
      onClick={() => onSuccess({ credential: "mock-credential" })}
    >
      Sign up with Google
    </button>
  ),
}));

// Mock useErrorPopup hook
vi.mock("../../../hooks/useErrorPopup", () => ({
  useErrorPopup: () => ({
    isOpen: false,
    error: null,
    showError: vi.fn(),
    hideError: vi.fn(),
  }),
}));

describe("SignupPage Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default successful signup
    mockRegister.mockResolvedValue(true);
    mockGoogleLogin.mockResolvedValue(true);

    // Mock auth context
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      register: mockRegister,
      googleLogin: mockGoogleLogin,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Custom render function that wraps the component with all necessary providers
  const renderSignupPage = () => {
    return render(
      <TestWrapper>
        <SignupPage />
      </TestWrapper>
    );
  };

  it("renders the signup form correctly", () => {
    renderSignupPage();

    // Check for heading and subheading
    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();

    // Check for form fields
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    // Check for buttons
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByTestId("google-signup")).toBeInTheDocument();
  });

  it("navigates to login page when login link is clicked", () => {
    renderSignupPage();

    const loginLink = screen.getByText("Sign in");
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest("a")).toHaveAttribute("href", "/login");
  });

  it("validates password length on submission", async () => {
    renderSignupPage();

    // Fill the form with a short password
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "short" }, // Less than 8 characters
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "short" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    // Check for validation error
    await waitFor(() => {
      expect(
        screen.getByText(/Password must be at least 8 characters long/i)
      ).toBeInTheDocument();
    });

    // Register should not have been called
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("validates matching passwords on submission", async () => {
    renderSignupPage();

    // Fill the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password456" }, // Different password
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    // Register should not have been called
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it("submits the form successfully with valid data", async () => {
    renderSignupPage();

    // Fill the form with valid data
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    // Check if register was called with correct arguments
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });

    // Check if navigation occurred
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("shows loading state during form submission", async () => {
    // Mock register to delay
    mockRegister.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
    );

    // Mock auth context with loading state
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      register: mockRegister,
      googleLogin: mockGoogleLogin,
      isLoading: true,
      error: null,
      isAuthenticated: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderSignupPage();

    // Fill the form with valid data
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    // Wait for the loading spinner to appear
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("handles registration failure and shows error", async () => {
    // Mock register to fail
    const errorMessage = "Email already in use";
    mockRegister.mockRejectedValue(new Error(errorMessage));

    renderSignupPage();

    // Fill the form with valid data
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "password123" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    // Check error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Navigation should not have been called
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handles Google sign-up correctly", async () => {
    renderSignupPage();

    // Click Google signup button
    fireEvent.click(screen.getByTestId("google-signup"));

    // Check if googleLogin was called with credential
    await waitFor(() => {
      expect(mockGoogleLogin).toHaveBeenCalledWith({
        credential: "mock-credential",
      });
    });

    // Check navigation
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("handles Google sign-up failure", async () => {
    // Mock Google login failure
    mockGoogleLogin.mockRejectedValue(
      new Error("Google authentication failed")
    );

    renderSignupPage();

    // Click Google signup button
    fireEvent.click(screen.getByTestId("google-signup"));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Google Sign-Up failed/i)).toBeInTheDocument();
    });

    // Navigation should not have been called
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
