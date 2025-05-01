import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResponsiveImage } from "../responsive-image";

describe("ResponsiveImage Component", () => {
  const defaultProps = {
    src: "/images/test-image.jpg",
    alt: "Test image",
  };

  it("renders with minimal props", () => {
    render(<ResponsiveImage {...defaultProps} />);

    const image = screen.getByAltText("Test image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/test-image.jpg");
    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).not.toHaveAttribute("srcSet");
    expect(image).not.toHaveAttribute("sizes");
    expect(image).toHaveClass("w-full");
    expect(image).toHaveClass("h-auto");
  });

  it("applies additional className", () => {
    const customClass = "rounded-lg shadow-md";
    render(<ResponsiveImage {...defaultProps} className={customClass} />);

    const image = screen.getByAltText("Test image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass(customClass);
    expect(image).toHaveClass("w-full");
    expect(image).toHaveClass("h-auto");
  });

  it("generates correct srcSet and sizes with widths", () => {
    const widths = {
      default: 600,
      sm: 400,
      md: 800,
      lg: 1200,
    };

    render(<ResponsiveImage {...defaultProps} widths={widths} />);

    const image = screen.getByAltText("Test image");
    expect(image).toBeInTheDocument();

    // Check srcSet and sizes attributes
    const srcSet = image.getAttribute("srcSet");
    expect(srcSet).toContain("/images/test-image.jpg?w=400 400w");
    expect(srcSet).toContain("/images/test-image.jpg?w=800 800w");
    expect(srcSet).toContain("/images/test-image.jpg?w=1200 1200w");

    const sizes = image.getAttribute("sizes");
    expect(sizes).toContain("(min-width: sm) 400px");
    expect(sizes).toContain("(min-width: md) 800px");
    expect(sizes).toContain("(min-width: lg) 1200px");
  });

  it("works with only default width", () => {
    const widths = {
      default: 600,
    };

    render(<ResponsiveImage {...defaultProps} widths={widths} />);

    const image = screen.getByAltText("Test image");
    expect(image).toBeInTheDocument();

    // With only default width, srcSet and sizes might be empty strings rather than null
    // so check that they're either empty or non-existent
    const srcSet = image.getAttribute("srcSet");
    expect(srcSet === null || srcSet === "").toBeTruthy();

    const sizes = image.getAttribute("sizes");
    expect(sizes === null || sizes === "").toBeTruthy();
  });
});
