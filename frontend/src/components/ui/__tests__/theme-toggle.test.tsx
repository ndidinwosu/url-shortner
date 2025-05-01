import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "../theme-toggle";
import * as themeContext from "../../../contexts/theme-context";

// Mock the theme context
vi.mock("../../../contexts/theme-context", () => ({
  useTheme: vi.fn(),
}));

describe("ThemeToggle Component", () => {
  it("renders premium version correctly", () => {
    // Mock the theme context to return premium version
    vi.spyOn(themeContext, "useTheme").mockImplementation(() => ({
      isPaidVersion: true,
      toggleVersion: vi.fn(),
      // Add required properties from the actual context
      theme: "dark",
      toggleTheme: vi.fn(),
    }));

    render(<ThemeToggle />);

    expect(screen.getByText("Premium")).toBeInTheDocument();
    // The crown icon should be present (verified by its parent button)
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("renders free version correctly", () => {
    // Mock the theme context to return free version
    vi.spyOn(themeContext, "useTheme").mockImplementation(() => ({
      isPaidVersion: false,
      toggleVersion: vi.fn(),
      // Add required properties from the actual context
      theme: "dark",
      toggleTheme: vi.fn(),
    }));

    render(<ThemeToggle />);

    expect(screen.getByText("Free")).toBeInTheDocument();
    // The user icon should be present (verified by its parent button)
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls toggleVersion when clicked", () => {
    // Create a mock function for toggleVersion
    const mockToggleVersion = vi.fn();

    // Mock the theme context
    vi.spyOn(themeContext, "useTheme").mockImplementation(() => ({
      isPaidVersion: false,
      toggleVersion: mockToggleVersion,
      // Add required properties from the actual context
      theme: "dark",
      toggleTheme: vi.fn(),
    }));

    render(<ThemeToggle />);

    // Click the toggle button
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Verify the toggle function was called
    expect(mockToggleVersion).toHaveBeenCalledTimes(1);
  });
});
