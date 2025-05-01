import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PremiumFeatures } from "../PremiumFeatures";
import * as themeContext from "../../../contexts/theme-context";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    section: ({ children, className }: any) => (
      <section className={className}>{children}</section>
    ),
  },
}));

// Mock theme context
vi.mock("../../../contexts/theme-context", () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("PremiumFeatures Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the premium features section with title and description", () => {
    render(<PremiumFeatures />);

    // Check for section title
    expect(screen.getByText("Upgrade to Premium")).toBeInTheDocument();

    // Check for section description
    expect(
      screen.getByText(
        "Get access to powerful features that help you manage, track, and optimize your shortened URLs."
      )
    ).toBeInTheDocument();
  });

  it("displays all feature cards with titles and descriptions", () => {
    render(<PremiumFeatures />);

    // Check for all feature titles
    expect(screen.getByText("QR Code Generation")).toBeInTheDocument();
    expect(screen.getByText("Advanced Analytics")).toBeInTheDocument();
    expect(screen.getByText("Custom Expiry Dates")).toBeInTheDocument();
    expect(screen.getByText("Custom URLs")).toBeInTheDocument();

    // Check for feature descriptions
    expect(
      screen.getByText(
        "Generate QR codes for your shortened URLs instantly. Perfect for print materials and physical displays."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Get detailed insights into your links' performance with comprehensive click tracking and analytics."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Set expiration dates for your links to create urgency or ensure temporary access."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create branded, memorable links with custom aliases that reflect your brand or campaign."
      )
    ).toBeInTheDocument();
  });

  it("works with dark theme", () => {
    // Mock theme hook to return dark theme
    vi.mocked(themeContext.useTheme).mockReturnValue({
      theme: "dark",
      toggleTheme: vi.fn(),
    });

    render(<PremiumFeatures />);

    // Verify that the component renders in dark theme
    expect(screen.getByText("Upgrade to Premium")).toBeInTheDocument();
  });
});
