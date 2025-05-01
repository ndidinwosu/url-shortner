import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "../Footer";

describe("Footer", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it("renders the company name and logo", () => {
    // Check for the company name
    expect(screen.getByText("ShortKing")).toBeInTheDocument();
  });

  it("renders all section headers", () => {
    expect(screen.getByText("Product")).toBeInTheDocument();
    expect(screen.getByText("Company")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
  });

  it("renders product links", () => {
    expect(screen.getByText("Features")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("FAQ")).toBeInTheDocument();
    expect(screen.getByText("API Documentation")).toBeInTheDocument();
  });

  it("renders company links", () => {
    expect(screen.getByText("About Us")).toBeInTheDocument();
    expect(screen.getByText("Team")).toBeInTheDocument();
    expect(screen.getByText("Careers")).toBeInTheDocument();
    expect(screen.getByText("Blog")).toBeInTheDocument();
  });

  it("renders legal links", () => {
    expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
    expect(screen.getByText("Terms of Service")).toBeInTheDocument();
    expect(screen.getByText("Cookie Policy")).toBeInTheDocument();
    expect(screen.getByText("GDPR")).toBeInTheDocument();
  });

  it("renders support links", () => {
    expect(screen.getByText("Help Center")).toBeInTheDocument();
    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Report Abuse")).toBeInTheDocument();
  });

  it("renders social media links", () => {
    expect(screen.getByText("Twitter")).toBeInTheDocument();
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("LinkedIn")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("displays the correct copyright year", () => {
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} ShortKing. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('renders the "Made with love" message', () => {
    expect(screen.getByText(/Made with/)).toBeInTheDocument();
    expect(screen.getByText(/by the ShortKing Team/)).toBeInTheDocument();
  });
});
