import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "../link";

describe("Link Component", () => {
  it("renders correctly with default props", () => {
    render(<Link href="/test">Test Link</Link>);

    const link = screen.getByText("Test Link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveClass("text-foreground/60"); // Default non-active class
    expect(link).not.toHaveClass("text-foreground");
  });

  it("renders correctly with active state", () => {
    render(
      <Link href="/test" active={true}>
        Active Link
      </Link>
    );

    const link = screen.getByText("Active Link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("text-foreground"); // Active class
    expect(link).toHaveClass("font-medium"); // Active class
    expect(link).not.toHaveClass("text-foreground/60");
  });

  it("applies additional className", () => {
    const customClass = "custom-link-class";
    render(
      <Link href="/test" className={customClass}>
        Custom Link
      </Link>
    );

    const link = screen.getByText("Custom Link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass(customClass);
    expect(link).toHaveClass("text-foreground/60"); // Default non-active class
  });

  it("passes additional props to the anchor element", () => {
    render(
      <Link
        href="/test"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="External link"
        data-testid="test-link"
      >
        Props Link
      </Link>
    );

    const link = screen.getByTestId("test-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("aria-label", "External link");
  });

  it("handles children content correctly", () => {
    render(
      <Link href="/test">
        <span>Nested</span> Content
      </Link>
    );

    expect(screen.getByText("Nested")).toBeInTheDocument();
    expect(screen.getByText(/Content/)).toBeInTheDocument();
  });

  it("correctly forwards the ref", () => {
    const refCallback = vi.fn();
    render(
      <Link href="/test" ref={refCallback}>
        Ref Link
      </Link>
    );

    // The ref callback should have been called with an HTMLAnchorElement
    expect(refCallback).toHaveBeenCalled();
    const refValue = refCallback.mock.calls[0][0];
    expect(refValue instanceof HTMLAnchorElement).toBe(true);
  });
});
