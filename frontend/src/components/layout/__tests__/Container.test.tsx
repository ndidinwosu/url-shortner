import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "../Container";

describe("Container", () => {
  it("renders children correctly", () => {
    render(
      <Container>
        <div data-testid="test-child">Test Content</div>
      </Container>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("applies the container class by default", () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );

    // Get the container div (parent of our content)
    const containerDiv = screen.getByText("Test Content").parentElement;
    expect(containerDiv).toHaveClass("container");
    expect(containerDiv).toHaveClass("mx-auto");
    expect(containerDiv).toHaveClass("px-4");
  });

  it("applies additional classes when provided", () => {
    const customClass = "test-custom-class";

    render(
      <Container className={customClass}>
        <div>Test Content</div>
      </Container>
    );

    const containerDiv = screen.getByText("Test Content").parentElement;
    expect(containerDiv).toHaveClass("container");
    expect(containerDiv).toHaveClass(customClass);
  });
});
