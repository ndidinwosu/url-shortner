import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorPopup } from "../ErrorPopup";
import * as themeContext from "../../contexts/theme-context";

// Mock theme context
vi.mock("../../contexts/theme-context", () => ({
  useTheme: vi.fn(),
}));

describe("ErrorPopup Component", () => {
  beforeEach(() => {
    // Default mock implementation for theme
    vi.spyOn(themeContext, "useTheme").mockReturnValue({
      theme: "light",
      toggleTheme: vi.fn(),
    });
  });

  it("renders nothing when isOpen is false", () => {
    render(<ErrorPopup isOpen={false} error="Test error" onClose={() => {}} />);

    // Should not find the error message in the document
    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
    expect(screen.queryByText("Error Message")).not.toBeInTheDocument();
  });

  it("renders the error message when isOpen is true", () => {
    render(<ErrorPopup isOpen={true} error="Test error" onClose={() => {}} />);

    // Should find the error message
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.getByText("Error Message")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const mockOnClose = vi.fn();

    render(
      <ErrorPopup isOpen={true} error="Test error" onClose={mockOnClose} />
    );

    // Click the close button
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    // onClose should have been called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the X button is clicked", () => {
    const mockOnClose = vi.fn();

    render(
      <ErrorPopup isOpen={true} error="Test error" onClose={mockOnClose} />
    );

    // Find the X button in the header and click it
    const xButton = screen.getByRole("button", { name: "" });
    fireEvent.click(xButton);

    // onClose should have been called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", () => {
    const mockOnClose = vi.fn();

    const { container } = render(
      <ErrorPopup isOpen={true} error="Test error" onClose={mockOnClose} />
    );

    // Find the backdrop (the outermost div)
    const backdrop = container.firstChild;
    if (backdrop) {
      fireEvent.click(backdrop);

      // onClose should have been called
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
      // If we can't find the backdrop, the test should fail
      expect(backdrop).not.toBeNull();
    }
  });

  it("calls onClose when escape key is pressed", () => {
    const mockOnClose = vi.fn();

    render(
      <ErrorPopup isOpen={true} error="Test error" onClose={mockOnClose} />
    );

    // Simulate pressing the Escape key
    fireEvent.keyDown(window, { key: "Escape" });

    // onClose should have been called
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles null error gracefully", () => {
    const { container } = render(
      <ErrorPopup isOpen={true} error={null} onClose={() => {}} />
    );

    // Should still render the popup
    expect(screen.getByText("Error Message")).toBeInTheDocument();

    // Find the paragraph with the error message class
    const errorParagraph = container.querySelector(".p-6 p.text-sm");
    expect(errorParagraph).toBeInTheDocument();
    expect(errorParagraph?.textContent).toBe("");
  });
});
