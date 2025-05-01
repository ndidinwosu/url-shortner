import { renderHook, act } from "@testing-library/react";
import { useUrls } from "./useUrls";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiClient } from "../lib/api-client";

vi.mock("../lib/api-client");

const mockAPIResponse = [
  {
    id: "1",
    short_url: "https://shortking.com/abc123",
    original_url: "https://www.example.com/very/long/url/that/needs/shortening",
    clicks: 150,
    created_at: new Date("2024-01-01").toISOString(),
    status: "active",
    expires_at: null,
    unique_visitors: 120,
    avg_response_time: 250,
    last_clicked: new Date("2024-01-20").toISOString(),
    device_stats: {
      mobile: 80,
      desktop: 60,
      tablet: 10,
    },
    location_stats: {
      "United States": 70,
      "United Kingdom": 30,
      Canada: 20,
      Others: 30,
    },
    referrer_stats: {
      Direct: 50,
      Google: 40,
      Twitter: 30,
      Others: 30,
    },
  },
];

describe("useUrls", () => {
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

    const { result } = renderHook(() => useUrls());

    expect(result.current.urls).toEqual([]);
    expect(result.current.isLoading).toBe(true); // Initial loading state is true
    expect(result.current.error).toBe(null);
  });

  it("should fetch URLs successfully", async () => {
    // Mock successful API response
    (apiClient.get as jest.Mock).mockResolvedValueOnce({
      data: mockAPIResponse,
    });

    const { result } = renderHook(() => useUrls());

    // Wait for the initial auto-fetch to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // The response should be transformed from snake_case to camelCase
    expect(result.current.urls).toEqual([
      {
        id: "1",
        shortUrl: "https://shortking.com/abc123",
        originalUrl:
          "https://www.example.com/very/long/url/that/needs/shortening",
        clicks: 150,
        createdAt: new Date("2024-01-01").toISOString(),
        status: "active",
        expiresAt: undefined,
        uniqueVisitors: 120,
        avgResponseTime: 250,
        lastClicked: new Date("2024-01-20").toISOString(),
        deviceStats: {
          mobile: 80,
          desktop: 60,
          tablet: 10,
        },
        locationStats: {
          "United States": 70,
          "United Kingdom": 30,
          Canada: 20,
          Others: 30,
        },
        referrerStats: {
          Direct: 50,
          Google: 40,
          Twitter: 30,
          Others: 30,
        },
      },
    ]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle URL fetching error", async () => {
    const { result } = renderHook(() => useUrls());

    // Mock console.error to prevent error output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock setTimeout to throw error
    const mockError = new Error("Failed to fetch URLs");
    vi.spyOn(global, "setTimeout").mockImplementationOnce(() => {
      throw mockError;
    });

    await act(async () => {
      try {
        await result.current.fetchUrls();
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe("Failed to fetch URLs");
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });

  it("should shorten URL successfully", async () => {
    // Mock API response for URL shortening
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: {
        id: "123",
        short_url: "https://short.king/abc123",
        original_url: "https://example.com/very/long/url",
        clicks: 0,
        created_at: new Date().toISOString(),
        status: "active",
        expires_at: null,
        qr_code: "mock-qr-code",
      },
    });

    const { result } = renderHook(() => useUrls());
    const longUrl = "https://example.com/very/long/url";

    await act(async () => {
      const shortenedUrl = await result.current.shortenUrl({ url: longUrl });

      expect(shortenedUrl).toMatchObject({
        originalUrl: longUrl,
        shortUrl: expect.stringContaining("http"),
        status: "active",
      });
    });
  });

  it("should handle custom alias in URL shortening", async () => {
    const customAlias = "custom-alias";
    // Mock API response for custom alias
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: {
        id: "123",
        short_url: `https://short.king/${customAlias}`,
        original_url: "https://example.com/very/long/url",
        clicks: 0,
        created_at: new Date().toISOString(),
        status: "active",
        expires_at: null,
        qr_code: "mock-qr-code",
      },
    });

    const { result } = renderHook(() => useUrls());
    const request = {
      url: "https://example.com/very/long/url",
      customAlias,
    };

    await act(async () => {
      const shortenedUrl = await result.current.shortenUrl(request);
      expect(shortenedUrl.shortUrl).toContain(request.customAlias);
    });
  });

  it("should handle expiration time in URL shortening", async () => {
    const expiresIn = 24; // 24 hours
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + expiresIn);

    // Mock API response with expiry time
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: {
        id: "123",
        short_url: "https://short.king/abc123",
        original_url: "https://example.com/very/long/url",
        clicks: 0,
        created_at: new Date().toISOString(),
        status: "active",
        expires_at: expiryDate.toISOString(),
        qr_code: "mock-qr-code",
      },
    });

    const { result } = renderHook(() => useUrls());
    const request = {
      url: "https://example.com/very/long/url",
      expiresIn,
    };

    await act(async () => {
      const shortenedUrl = await result.current.shortenUrl(request);

      expect(shortenedUrl.expiresAt).toBeTruthy();
      const returnedExpiryDate = new Date(shortenedUrl.expiresAt!);
      const hoursDiff =
        (returnedExpiryDate.getTime() - new Date().getTime()) /
        (1000 * 60 * 60);

      expect(Math.round(hoursDiff)).toBe(expiresIn);
    });
  });
});
