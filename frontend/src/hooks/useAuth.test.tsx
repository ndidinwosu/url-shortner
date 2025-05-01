import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiClient } from "../lib/api-client";

vi.mock("../lib/api-client");

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.post as jest.Mock)?.mockReset();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle successful login", async () => {
    const mockResponse = { data: { token: "mock-token" } };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.login({
        email: "testuser@example.com",
        password: "test1234",
      });
      expect(success).toBe(true);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle failed login", async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce(
      new Error("Login failed")
    );
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(
        result.current.login({
          email: "wrong@example.com",
          password: "wrongpass",
        })
      ).rejects.toThrow("Login failed");
    });

    expect(result.current.error).toBe("Login failed");
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle successful Google login", async () => {
    const mockResponse = { data: { token: "mock-google-token" } };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.googleLogin({
        credential: "valid-token",
      });
      expect(success).toBe(true);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle successful signup", async () => {
    const mockResponse = { data: { token: "mock-signup-token" } };
    (apiClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      const success = await result.current.signup({
        email: "newuser@example.com",
        password: "newpass123",
      });
      expect(success).toBe(true);
    });

    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it("should handle failed signup", async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce(
      new Error("Signup failed")
    );
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await expect(
        result.current.signup({
          email: "invalid@example.com",
          password: "invalidpass",
        })
      ).rejects.toThrow("Signup failed");
    });

    expect(result.current.error).toBe("Signup failed");
    expect(result.current.isLoading).toBe(false);
  });
});
