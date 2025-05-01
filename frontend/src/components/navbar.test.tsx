import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../test/test-utils";
import { Navbar } from "./navbar";
import * as authContext from "../contexts/auth-context";
import { MemoryRouter } from "react-router-dom";

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock auth context
    vi.spyOn(authContext, "useAuth").mockImplementation(() => ({
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      googleLogin: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    }));
  });

  it("renders basic navbar elements", () => {
    render(<Navbar />, { route: "/" });

    expect(screen.getByText("ShortKing")).toBeInTheDocument();
    expect(screen.getByTestId("crown-icon")).toBeInTheDocument();
  });

  it("shows navigation links when authenticated", () => {
    render(<Navbar />, { route: "/" });

    expect(
      screen.getByRole("link", { name: /shorten url/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /dashboard/i })
    ).toBeInTheDocument();
  });

  it("hides navigation links when not authenticated", () => {
    vi.spyOn(authContext, "useAuth").mockImplementation(() => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: vi.fn(),
      googleLogin: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    }));

    render(<Navbar />, { route: "/" });

    expect(
      screen.queryByRole("link", { name: /shorten url/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /dashboard/i })
    ).not.toBeInTheDocument();
  });

  it("applies active styles to current route", () => {
    render(<Navbar />, { route: "/dashboard" });

    const link = screen.getByRole("link", { name: /dashboard/i });
    expect(link).toHaveClass("text-primary");
  });
});
