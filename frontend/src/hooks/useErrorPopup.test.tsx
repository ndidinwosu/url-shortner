import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useErrorPopup } from "./useErrorPopup";

describe("useErrorPopup Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with closed state and no error", () => {
    const { result } = renderHook(() => useErrorPopup());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should show error when showError is called", () => {
    const { result } = renderHook(() => useErrorPopup());

    act(() => {
      result.current.showError("Test error message");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.error).toBe("Test error message");
  });

  it("should hide error immediately when hideError is called", () => {
    const { result } = renderHook(() => useErrorPopup());

    // First show an error
    act(() => {
      result.current.showError("Test error message");
    });

    // Then hide it
    act(() => {
      result.current.hideError();
    });

    // The popup should close immediately
    expect(result.current.isOpen).toBe(false);
    // But the error message should still be there (until timeout)
    expect(result.current.error).toBe("Test error message");
  });

  it("should clear error message after animation timeout when hideError is called", () => {
    const { result } = renderHook(() => useErrorPopup());

    // Show an error
    act(() => {
      result.current.showError("Test error message");
    });

    // Hide the error
    act(() => {
      result.current.hideError();
    });

    // Advance timers to simulate animation completion
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Now the error message should be cleared
    expect(result.current.isOpen).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle multiple error messages", () => {
    const { result } = renderHook(() => useErrorPopup());

    // Show first error
    act(() => {
      result.current.showError("First error");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.error).toBe("First error");

    // Show second error
    act(() => {
      result.current.showError("Second error");
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.error).toBe("Second error");
  });
});
