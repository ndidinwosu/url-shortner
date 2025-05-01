import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Grid } from "../Grid";

describe("Grid", () => {
  it("renders children correctly", () => {
    render(
      <Grid>
        <div data-testid="test-child-1">Child 1</div>
        <div data-testid="test-child-2">Child 2</div>
      </Grid>
    );

    expect(screen.getByTestId("test-child-1")).toBeInTheDocument();
    expect(screen.getByTestId("test-child-2")).toBeInTheDocument();
  });

  it("applies default grid classes", () => {
    render(
      <Grid>
        <div>Grid Item</div>
      </Grid>
    );

    const gridElement = screen.getByText("Grid Item").parentElement;
    expect(gridElement).toHaveClass("grid");
    expect(gridElement).toHaveClass("grid-cols-1");
    expect(gridElement).toHaveClass("sm:grid-cols-2");
    expect(gridElement).toHaveClass("md:grid-cols-3");
    expect(gridElement).toHaveClass("lg:grid-cols-4");
    expect(gridElement).toHaveClass("gap-4");
  });

  it("applies custom column configuration", () => {
    render(
      <Grid
        cols={{
          default: 2,
          sm: 3,
          md: 4,
          lg: 5,
          xl: 6,
          "2xl": 7,
        }}
      >
        <div>Grid Item</div>
      </Grid>
    );

    const gridElement = screen.getByText("Grid Item").parentElement;
    expect(gridElement).toHaveClass("grid-cols-2");
    expect(gridElement).toHaveClass("sm:grid-cols-3");
    expect(gridElement).toHaveClass("md:grid-cols-4");
    expect(gridElement).toHaveClass("lg:grid-cols-5");
    expect(gridElement).toHaveClass("xl:grid-cols-6");
    expect(gridElement).toHaveClass("2xl:grid-cols-7");
  });

  it("applies custom gap", () => {
    render(
      <Grid gap="gap-8">
        <div>Grid Item</div>
      </Grid>
    );

    const gridElement = screen.getByText("Grid Item").parentElement;
    expect(gridElement).toHaveClass("gap-8");
    expect(gridElement).not.toHaveClass("gap-4"); // Default gap should be overridden
  });

  it("applies additional custom classes", () => {
    render(
      <Grid className="custom-class test-class">
        <div>Grid Item</div>
      </Grid>
    );

    const gridElement = screen.getByText("Grid Item").parentElement;
    expect(gridElement).toHaveClass("custom-class");
    expect(gridElement).toHaveClass("test-class");
  });

  it("combines all custom props correctly", () => {
    render(
      <Grid
        cols={{ default: 2, md: 4 }}
        gap="gap-6"
        className="test-custom-class"
      >
        <div>Grid Item</div>
      </Grid>
    );

    const gridElement = screen.getByText("Grid Item").parentElement;
    expect(gridElement).toHaveClass("grid");
    expect(gridElement).toHaveClass("grid-cols-2");
    expect(gridElement).toHaveClass("md:grid-cols-4");
    expect(gridElement).toHaveClass("gap-6");
    expect(gridElement).toHaveClass("test-custom-class");
  });
});
