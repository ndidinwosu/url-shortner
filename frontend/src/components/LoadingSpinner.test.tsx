import { describe, it, expect } from "vitest";
import { render, screen } from "../test/test-utils";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default size", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-8", "w-8");
  });

  it("renders with custom size", () => {
    render(<LoadingSpinner size={16} />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("h-16", "w-16");
  });

  it("renders with custom className", () => {
    render(<LoadingSpinner className="text-red-500" />);

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("text-red-500");
  });
});
