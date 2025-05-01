import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Team } from "../Team";

// Mock react-slick to avoid slider rendering issues
vi.mock("react-slick", () => {
  return {
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="slider">{children}</div>
    ),
  };
});

// Mock slick carousel CSS imports
vi.mock("slick-carousel/slick/slick.css", () => ({}));
vi.mock("slick-carousel/slick/slick-theme.css", () => ({}));

// Mock theme context
vi.mock("../../../contexts/theme-context", () => ({
  useTheme: vi.fn().mockReturnValue({
    theme: "light",
    toggleTheme: vi.fn(),
  }),
}));

describe("Team Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the team section with title and description", () => {
    render(<Team />);

    // Check for section title and subtitle
    expect(screen.getByText("Meet Our Team")).toBeInTheDocument();
    expect(
      screen.getByText("The talented people behind ShortKing")
    ).toBeInTheDocument();
  });

  it("displays the slider component", () => {
    render(<Team />);

    expect(screen.getByTestId("slider")).toBeInTheDocument();
  });

  it("renders all team members correctly", () => {
    render(<Team />);

    // Check all team members are rendered
    expect(screen.getByText("Shao-Hsiang Chien")).toBeInTheDocument();
    expect(screen.getByText("Hua-Yu Cheng")).toBeInTheDocument();
    expect(screen.getByText("Cho-Yun Lei")).toBeInTheDocument();
    expect(screen.getByText("Ndidi Nwosu")).toBeInTheDocument();
    expect(screen.getByText("Boya Chang")).toBeInTheDocument();
    expect(screen.getByText("Yucheng Yan")).toBeInTheDocument();
  });

  it("displays team member roles and descriptions", () => {
    render(<Team />);

    // Verify roles are displayed
    const teamMemberRoleElements = screen.getAllByText("Team Member");
    expect(teamMemberRoleElements).toHaveLength(6);

    // Check descriptions for each team member
    expect(
      screen.getByText(
        "Software Developer with expertise in full-stack development."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Experienced in web development and system architecture."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Specialized in frontend development and user experience."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Expert in backend development and database management.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Focused on software testing and quality assurance.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Specialized in system integration and deployment.")
    ).toBeInTheDocument();
  });

  it("renders social media buttons for each team member", () => {
    render(<Team />);

    // Each member has 3 social links, and there are 6 members
    const socialButtons = screen.getAllByRole("button");
    expect(socialButtons.length).toBe(18);
  });
});
