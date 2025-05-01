import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LandingPage } from "../LandingPage";
import { BrowserRouter } from "react-router-dom";

// Mock the child components
vi.mock("../../features/PremiumFeatures", () => ({
  PremiumFeatures: () => (
    <div data-testid="premium-features">Premium Features Mock</div>
  ),
}));

vi.mock("../../features/SocialProof", () => ({
  SocialProof: () => <div data-testid="social-proof">Social Proof Mock</div>,
}));

vi.mock("../../url-shortener-form", () => ({
  URLShortenerForm: () => (
    <div data-testid="url-shortener-form">URL Shortener Form Mock</div>
  ),
}));

vi.mock("../../layout/Footer", () => ({
  Footer: () => <div data-testid="footer">Footer Mock</div>,
}));

vi.mock("../../features/Pricing", () => ({
  Pricing: () => <div data-testid="pricing">Pricing Mock</div>,
}));

vi.mock("../../features/Team", () => ({
  Team: () => <div data-testid="team">Team Mock</div>,
}));

vi.mock("../../features/FAQ", () => ({
  FAQ: () => <div data-testid="faq">FAQ Mock</div>,
}));

vi.mock("../../layout/Container", () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    section: ({ children, className }: any) => (
      <section className={className}>{children}</section>
    ),
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
    h1: ({ children, className }: any) => (
      <h1 className={className}>{children}</h1>
    ),
    p: ({ children, className }: any) => (
      <p className={className}>{children}</p>
    ),
  },
}));

describe("LandingPage Component", () => {
  it("renders the landing page with header and main components", () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Check for heading text
    expect(screen.getByText(/Shorten Your Links/i)).toBeInTheDocument();
    expect(screen.getByText(/Expand Your Reach/i)).toBeInTheDocument();

    // Check for sub-heading
    expect(
      screen.getByText(/Transform long URLs into concise, shareable links/i)
    ).toBeInTheDocument();

    // Check for URL shortener form
    expect(screen.getByTestId("url-shortener-form")).toBeInTheDocument();

    // Check for scroll hint
    expect(screen.getByText(/Scroll to explore more/i)).toBeInTheDocument();
  });

  it("renders all feature sections", () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Check for all the main sections
    expect(screen.getByTestId("premium-features")).toBeInTheDocument();
    expect(screen.getByTestId("social-proof")).toBeInTheDocument();
    expect(screen.getByTestId("pricing")).toBeInTheDocument();
    expect(screen.getByTestId("team")).toBeInTheDocument();
    expect(screen.getByTestId("faq")).toBeInTheDocument();

    // Check for footer
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders within a container component", () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    // Check that the content is wrapped in a container
    expect(screen.getByTestId("container")).toBeInTheDocument();
  });
});
