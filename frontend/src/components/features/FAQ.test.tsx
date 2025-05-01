import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "../../test/test-utils";
import { FAQ } from "./FAQ";

describe("FAQ", () => {
  it("renders FAQ section with title", () => {
    render(<FAQ />);

    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
  });

  it("renders all FAQ questions", () => {
    render(<FAQ />);

    const questions = [
      "What is URL shortening?",
      "How secure are the shortened URLs?",
      "Can I customize my shortened URLs?",
      "How long do shortened URLs last?",
      "What analytics do you provide?",
    ];

    questions.forEach((question) => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  it("shows answer when question is clicked", async () => {
    render(<FAQ />);

    // Click the first question
    const firstQuestion = screen.getByTestId("faq-question-0");
    fireEvent.click(firstQuestion);

    // Check if the answer is visible
    expect(screen.getByTestId("faq-answer-0")).toBeInTheDocument();
  });

  it("hides answer when question is clicked again", async () => {
    render(<FAQ />);

    const question = screen.getByTestId("faq-question-0");

    // First click to show
    fireEvent.click(question);
    expect(screen.getByTestId("faq-answer-0")).toBeInTheDocument();

    // Second click to hide
    fireEvent.click(question);

    // Wait for the animation to complete and element to be removed
    await waitFor(() => {
      expect(screen.queryByTestId("faq-answer-0")).not.toBeInTheDocument();
    });
  });

  it("can have multiple answers visible at once", () => {
    render(<FAQ />);

    // Click first and second questions
    fireEvent.click(screen.getByTestId("faq-question-0"));
    fireEvent.click(screen.getByTestId("faq-question-1"));

    // Both answers should be visible
    expect(screen.getByTestId("faq-answer-0")).toBeInTheDocument();
    expect(screen.getByTestId("faq-answer-1")).toBeInTheDocument();
  });

  it("applies correct styling to active question", () => {
    render(<FAQ />);

    const question = screen.getByText("What is URL shortening?");

    // Initial state
    expect(question).not.toHaveClass("text-primary");

    // After click
    fireEvent.click(screen.getByTestId("faq-question-0"));
    expect(question).toHaveClass("text-primary");

    // After second click
    fireEvent.click(screen.getByTestId("faq-question-0"));
    expect(question).not.toHaveClass("text-primary");
  });
});
