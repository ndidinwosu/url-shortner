import { renderHook, act } from "@testing-library/react";
import { useUser } from "./useUser";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockUser, mockPreferences } from "../test/mock-data";

describe("useUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useUser());

    expect(result.current.user).toBe(null);
    expect(result.current.preferences).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should fetch user data successfully", async () => {
    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.fetchUser();
    });

    expect(result.current.user).toMatchObject({
      id: expect.any(String),
      email: expect.any(String),
      name: expect.any(String),
    });
    expect(result.current.preferences).toMatchObject({
      theme: expect.any(String),
      customDomain: null,
      defaultExpiryDays: expect.any(Number),
      emailNotifications: expect.any(Boolean),
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle user data fetching error", async () => {
    const { result } = renderHook(() => useUser());

    // Mock console.error to prevent error output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock setTimeout to throw error
    vi.spyOn(global, "setTimeout").mockImplementationOnce(() => {
      throw new Error("Failed to fetch user data");
    });

    await act(async () => {
      try {
        await result.current.fetchUser();
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe("Failed to fetch user data");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.preferences).toBe(null);

    consoleSpy.mockRestore();
  });

  it("should update preferences successfully", async () => {
    const { result } = renderHook(() => useUser());

    // First fetch user data
    await act(async () => {
      await result.current.fetchUser();
    });

    const newPreferences = {
      emailNotifications: false,
      theme: "dark",
    };

    await act(async () => {
      const success = await result.current.updatePreferences(newPreferences);
      expect(success).toBe(true);
    });

    // Check if the preferences were updated correctly
    expect(result.current.preferences).toEqual({
      ...mockPreferences,
      ...newPreferences,
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle preferences update error", async () => {
    const { result } = renderHook(() => useUser());

    // Mock console.error to prevent error output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock setTimeout to throw error
    const mockError = new Error("Failed to update preferences");
    vi.spyOn(global, "setTimeout").mockImplementationOnce(() => {
      throw mockError;
    });

    await act(async () => {
      try {
        const success = await result.current.updatePreferences({
          theme: "dark",
        });
        expect(success).toBe(false);
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe("Failed to update preferences");
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });
});
