import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, badgeVariants } from "../badge";

describe("Badge Component", () => {
  it("renders with default variant", () => {
    render(<Badge>Test Badge</Badge>);

    const badge = screen.getByText("Test Badge");
    expect(badge).toBeInTheDocument();

    // Check that default variant classes are applied
    expect(badge).toHaveClass("bg-primary");
    expect(badge).toHaveClass("text-primary-foreground");
  });

  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    const badge = screen.getByText("Secondary Badge");
    expect(badge).toBeInTheDocument();

    // Check that secondary variant classes are applied
    expect(badge).toHaveClass("bg-secondary");
    expect(badge).toHaveClass("text-secondary-foreground");
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);

    const badge = screen.getByText("Destructive Badge");
    expect(badge).toBeInTheDocument();

    // Check that destructive variant classes are applied
    expect(badge).toHaveClass("bg-destructive");
    expect(badge).toHaveClass("text-destructive-foreground");
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);

    const badge = screen.getByText("Outline Badge");
    expect(badge).toBeInTheDocument();

    // Check that outline variant classes are applied
    expect(badge).toHaveClass("text-foreground");
    expect(badge).toHaveClass("border-input");
  });

  it("applies additional className", () => {
    const customClass = "custom-test-class";
    render(<Badge className={customClass}>Custom Class Badge</Badge>);

    const badge = screen.getByText("Custom Class Badge");
    expect(badge).toBeInTheDocument();

    // Check that custom class is applied alongside variant classes
    expect(badge).toHaveClass(customClass);
    expect(badge).toHaveClass("bg-primary"); // Default variant should still be applied
  });

  it("passes additional props to the div element", () => {
    render(
      <Badge data-testid="test-badge" aria-label="badge label">
        Props Badge
      </Badge>
    );

    const badge = screen.getByTestId("test-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("aria-label", "badge label");
    expect(badge.textContent).toBe("Props Badge");
  });

  it("handles children content correctly", () => {
    render(
      <Badge>
        <span>Nested</span> Content
      </Badge>
    );

    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText(/Content/)).toBeInTheDocument();
  });
});
