import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileNav } from "../MobileNav";

describe("MobileNav", () => {
  // Mock document.body.style.overflow
  const originalStyle = document.body.style;

  beforeEach(() => {
    // Create a new style object that we can spy on
    Object.defineProperty(document.body, "style", {
      value: {
        overflow: "",
      },
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original style
    Object.defineProperty(document.body, "style", {
      value: originalStyle,
      configurable: true,
    });
  });

  it("renders the hamburger menu button", () => {
    render(
      <MobileNav>
        <div>Mobile Menu Content</div>
      </MobileNav>
    );

    // Button should be visible with the correct aria-label
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it("does not show menu content initially", () => {
    render(
      <MobileNav>
        <div>Mobile Menu Content</div>
      </MobileNav>
    );

    // Menu content should not be visible initially
    expect(screen.queryByText("Mobile Menu Content")).not.toBeInTheDocument();
  });

  it("shows menu content when button is clicked", () => {
    render(
      <MobileNav>
        <div>Mobile Menu Content</div>
      </MobileNav>
    );

    // Click the menu button
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    // Menu content should now be visible
    expect(screen.getByText("Mobile Menu Content")).toBeInTheDocument();

    // Button should now be "Close menu"
    expect(
      screen.getByRole("button", { name: /close menu/i })
    ).toBeInTheDocument();
  });

  it("hides menu content when close button is clicked", () => {
    render(
      <MobileNav>
        <div>Mobile Menu Content</div>
      </MobileNav>
    );

    // Open the menu
    const openButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(openButton);

    // Menu content should be visible
    expect(screen.getByText("Mobile Menu Content")).toBeInTheDocument();

    // Close the menu
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);

    // Menu content should no longer be visible
    expect(screen.queryByText("Mobile Menu Content")).not.toBeInTheDocument();
  });

  it("prevents body scrolling when menu is open", () => {
    render(
      <MobileNav>
        <div>Mobile Menu Content</div>
      </MobileNav>
    );

    // Initially overflow should not be set to hidden
    expect(document.body.style.overflow).not.toBe("hidden");

    // Open the menu
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    // Body overflow should be hidden
    expect(document.body.style.overflow).toBe("hidden");

    // Close the menu
    const closeButton = screen.getByRole("button", { name: /close menu/i });
    fireEvent.click(closeButton);

    // Body overflow should be restored
    expect(document.body.style.overflow).toBe("");
  });

  it("restores body scrolling on unmount", () => {
    const { unmount } = render(
      <MobileNav>
        <div>Mobile Menu Content</div>
      </MobileNav>
    );

    // Open the menu
    const menuButton = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(menuButton);

    // Body overflow should be hidden
    expect(document.body.style.overflow).toBe("hidden");

    // Unmount component
    unmount();

    // Body overflow should be restored
    expect(document.body.style.overflow).toBe("");
  });
});
