import { renderHook, act } from "@testing-library/react";
import { useStats } from "./useStats";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiClient } from "../lib/api-client";

vi.mock("../lib/api-client");

const mockAPIResponse = {
  total_urls: 2,
  total_clicks: 225,
  active_urls: 1,
  expired_urls: 1,
  avg_response_time: 215,
  unique_visitors: 185,
};

const expectedTransformedStats = {
  totalUrls: 2,
  totalClicks: 225,
  activeUrls: 1,
  expiredUrls: 1,
  avgResponseTime: 215,
  uniqueVisitors: 185,
};

describe("useStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation before each test
    (apiClient.get as jest.Mock).mockReset();
  });

  it("should initialize with default values", () => {
    // Mock the API to prevent auto-fetch
    (apiClient.get as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    const { result } = renderHook(() => useStats());

    expect(result.current.stats).toBe(null);
    expect(result.current.isLoading).toBe(true); // Initial loading state is true
    expect(result.current.error).toBe(null);
  });

  it("should fetch stats successfully", async () => {
    // Mock successful API response
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockAPIResponse,
    });

    const { result } = renderHook(() => useStats());

    // Wait for the initial auto-fetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Verify the stats were transformed correctly
    expect(result.current.stats).toEqual(expectedTransformedStats);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle stats fetching error", async () => {
    const error = new Error("Failed to fetch stats");
    (apiClient.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useStats());

    await act(async () => {
      await result.current.fetchStats();
    });

    expect(result.current.error).toBe("Failed to fetch stats");
    expect(result.current.isLoading).toBe(false);
  });
});
