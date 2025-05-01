import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SocialProof } from "../SocialProof";

// Mock theme context
vi.mock("../../../contexts/theme-context", () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("SocialProof Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the social proof section with title and description", () => {
    render(<SocialProof />);

    // Check for section title and subtitle
    expect(screen.getByText("Trusted by Thousands")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Join the growing community of satisfied ShortKing users"
      )
    ).toBeInTheDocument();
  });

  it("displays all statistics correctly", () => {
    render(<SocialProof />);

    // Check all stats are rendered
    expect(screen.getByText("1M+")).toBeInTheDocument();
    expect(screen.getByText("Links Created")).toBeInTheDocument();

    expect(screen.getByText("50K+")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();

    expect(screen.getByText("100M+")).toBeInTheDocument();
    expect(screen.getByText("Total Clicks")).toBeInTheDocument();

    expect(screen.getByText("99.9%")).toBeInTheDocument();
    expect(screen.getByText("Uptime")).toBeInTheDocument();
  });

  it("displays all testimonials correctly", () => {
    render(<SocialProof />);

    // Check testimonial 1
    expect(screen.getByText("Sarah Johnson")).toBeInTheDocument();
    expect(
      screen.getByText("Digital Marketing Manager at TechCorp")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "ShortKing has revolutionized how we manage our marketing campaigns. The analytics are invaluable!"
      )
    ).toBeInTheDocument();

    // Check testimonial 2
    expect(screen.getByText("Michael Chen")).toBeInTheDocument();
    expect(
      screen.getByText("Content Creator at CreativeHub")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The QR code feature is a game-changer for my offline to online content strategy."
      )
    ).toBeInTheDocument();

    // Check testimonial 3
    expect(screen.getByText("Emily Rodriguez")).toBeInTheDocument();
    expect(
      screen.getByText("Social Media Manager at SocialBoost")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Custom URLs have helped us maintain brand consistency across all platforms."
      )
    ).toBeInTheDocument();
  });

  it("includes avatar images for testimonials", () => {
    render(<SocialProof />);

    // Check that all testimonial images are rendered
    const avatarImages = screen.getAllByRole("img");
    expect(avatarImages).toHaveLength(3);

    expect(avatarImages[0]).toHaveAttribute("alt", "Sarah Johnson");
    expect(avatarImages[1]).toHaveAttribute("alt", "Michael Chen");
    expect(avatarImages[2]).toHaveAttribute("alt", "Emily Rodriguez");
  });
});
