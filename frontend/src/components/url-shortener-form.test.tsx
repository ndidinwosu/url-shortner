import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../test/test-utils";
import { URLShortenerForm } from "./url-shortener-form";
import * as themeContext from "../contexts/theme-context";
import * as urlsHook from "../hooks/useUrls";
import * as authContext from "../contexts/auth-context";

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

// Mock the API module
vi.mock("../lib/api", () => ({
  shortenUrl: vi.fn(),
  checkUrlSafety: vi.fn().mockResolvedValue({ threat: null }), // Mock URL safety check
}));

// Mock the theme context
vi.mock("../contexts/theme-context", async () => {
  const actual = await vi.importActual<
    typeof import("../contexts/theme-context")
  >("../contexts/theme-context");
  return {
    ...actual,
    useTheme: () => ({
      isPaidVersion: false,
      toggleVersion: vi.fn(),
    }),
  };
});

// Mock the auth context module
vi.mock("../contexts/auth-context", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: vi.fn(),
    googleLogin: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock useUrls hook
vi.mock("../hooks/useUrls");

describe("URLShortenerForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.spyOn(urlsHook, "useUrls").mockImplementation(() => ({
      shortenUrl: vi.fn().mockResolvedValue({
        shortUrl: "https://short.king/abc123",
        qrCode: "mock-qr-code-data",
      }),
      checkUrlSafety: vi.fn().mockResolvedValue({ threat: null }),
      isLoading: false,
      error: null,
    }));
  });

  it("renders the form correctly", () => {
    render(<URLShortenerForm />);
    expect(screen.getByLabelText(/enter your long url/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /shorten url/i })
    ).toBeInTheDocument();
  });

  it("handles URL submission correctly", async () => {
    render(<URLShortenerForm />);

    fireEvent.change(screen.getByLabelText(/enter your long url/i), {
      target: { value: "https://example.com/very/long/url" },
    });

    fireEvent.click(screen.getByRole("button", { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByTestId("shortened-url")).toHaveTextContent(
        "https://short.king/abc123"
      );
    });
  });

  it("displays error message when URL shortening fails", async () => {
    // Mock the useUrls hook to return an error
    vi.spyOn(urlsHook, "useUrls").mockImplementation(() => ({
      shortenUrl: vi.fn().mockRejectedValue(new Error("API Error")),
      checkUrlSafety: vi.fn().mockResolvedValue({ threat: null }),
      isLoading: false,
      error: "Failed to shorten URL",
    }));

    render(<URLShortenerForm />);

    fireEvent.change(screen.getByLabelText(/enter your long url/i), {
      target: { value: "https://example.com/very/long/url" },
    });

    fireEvent.click(screen.getByRole("button", { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to shorten url/i)).toBeInTheDocument();
    });
  });

  it("shows loading state while submitting", async () => {
    // Mock the useUrls hook to show the component in a loading state
    vi.spyOn(urlsHook, "useUrls").mockImplementation(() => ({
      shortenUrl: vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100))
        ),
      checkUrlSafety: vi
        .fn()
        .mockImplementation(
          () => new Promise((resolve) => setTimeout(resolve, 100))
        ),
      isLoading: true,
      error: null,
    }));

    render(<URLShortenerForm />);

    fireEvent.change(screen.getByLabelText(/enter your long url/i), {
      target: { value: "https://example.com/very/long/url" },
    });

    fireEvent.click(screen.getByRole("button", { name: /shorten url/i }));

    // When the button is in loading state, it should show "Checking..." text
    expect(screen.getByText(/checking/i)).toBeInTheDocument();
  });

  it("handles custom alias and expiry time when premium", async () => {
    // Mock theme context to enable premium features
    vi.spyOn(themeContext, "useTheme").mockImplementation(() => ({
      isPaidVersion: true,
      toggleVersion: vi.fn(),
    }));

    const mockShortUrl = "https://short.king/custom-alias";
    const mockShortenUrl = vi.fn().mockResolvedValue({
      shortUrl: mockShortUrl,
      qrCode: "mock-qr-code-data",
    });

    vi.spyOn(urlsHook, "useUrls").mockImplementation(() => ({
      shortenUrl: mockShortenUrl,
      checkUrlSafety: vi.fn().mockResolvedValue({ threat: null }),
      isLoading: false,
      error: null,
    }));

    render(<URLShortenerForm />);

    // Fill in all fields
    fireEvent.change(screen.getByLabelText(/enter your long url/i), {
      target: { value: "https://example.com/very/long/url" },
    });

    // Premium fields should now be visible
    const aliasInput = screen.getByLabelText(/custom alias/i);
    // Try different variations of the expiry label text
    const expiryInput = screen.getByLabelText(
      /time to live|expiry time|expires in|expiration/i
    );

    fireEvent.change(aliasInput, {
      target: { value: "custom-alias" },
    });
    fireEvent.change(expiryInput, {
      target: { value: "24" },
    });

    fireEvent.click(screen.getByRole("button", { name: /shorten url/i }));

    await waitFor(() => {
      expect(mockShortenUrl).toHaveBeenCalledWith({
        url: "https://example.com/very/long/url",
        custom_alias: "custom-alias",
        expires_in: 24,
      });
      expect(screen.getByTestId("shortened-url")).toHaveTextContent(
        mockShortUrl
      );
    });
  });
});
