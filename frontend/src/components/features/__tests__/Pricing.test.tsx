import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pricing } from "../Pricing";

// Mock theme context
vi.mock("../../../contexts/theme-context", () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("Pricing Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the pricing section with title and description", () => {
    render(<Pricing />);

    // Check for section title and subtitle
    expect(screen.getByText("Simple, Transparent Pricing")).toBeInTheDocument();
    expect(
      screen.getByText("Choose the plan that's right for you")
    ).toBeInTheDocument();
  });

  it("displays the Free pricing plan with correct details", () => {
    render(<Pricing />);

    // Check Free plan details
    expect(screen.getByText("Free")).toBeInTheDocument();
    expect(screen.getByText("$0")).toBeInTheDocument();
    expect(screen.getByText("For personal use")).toBeInTheDocument();

    // Check Free plan features
    expect(screen.getByText("Basic URL shortening")).toBeInTheDocument();
    expect(screen.getByText("Basic click tracking")).toBeInTheDocument();
    expect(screen.getByText("Standard support")).toBeInTheDocument();

    // Check button text
    expect(screen.getByText("Current Plan")).toBeInTheDocument();
  });

  it("displays the Premium pricing plan with correct details", () => {
    render(<Pricing />);

    // Check Premium plan details
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("$9.99")).toBeInTheDocument();
    expect(screen.getByText("For professionals")).toBeInTheDocument();
    expect(screen.getByText("Popular")).toBeInTheDocument();

    // Check Premium plan features
    expect(screen.getByText("All Free features, plus:")).toBeInTheDocument();
    expect(screen.getByText("QR code generation")).toBeInTheDocument();
    expect(screen.getByText("Advanced analytics")).toBeInTheDocument();
    expect(screen.getByText("Custom URLs")).toBeInTheDocument();
    expect(screen.getByText("Priority support")).toBeInTheDocument();

    // Check button text
    expect(screen.getByText("Upgrade Now")).toBeInTheDocument();
  });
});
