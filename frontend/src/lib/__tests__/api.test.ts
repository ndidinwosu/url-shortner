import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getUserUrls,
  getUserStats,
  shortenUrl,
  checkUrlSafety,
  updateAlias,
  type URLShortenRequest,
  type WebRiskResponse,
} from "../api";

// Mock fetch globally
vi.stubGlobal("fetch", vi.fn());

// Store the original environment
const originalEnv = process.env.NODE_ENV;

describe("API Functions", () => {
  // Setup and teardown for each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset process.env.NODE_ENV to 'test' for all tests by default
    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    // Restore the original environment
    process.env.NODE_ENV = originalEnv;
  });

  describe("getUserUrls", () => {
    it("should return mock data in development environment", async () => {
      // Set environment to development
      process.env.NODE_ENV = "development";

      const result = await getUserUrls();

      // Verify that we got mock data (array with at least one item)
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("shortUrl");
      expect(result[0]).toHaveProperty("originalUrl");
    });

    it("should fetch data from API in production environment", async () => {
      // Mock successful fetch response
      const mockResponse = [
        {
          id: "test1",
          shortUrl: "https://shortking.com/test1",
          originalUrl: "https://example.com/test1",
          clicks: 5,
          createdAt: "2024-01-01T00:00:00.000Z",
          status: "active",
        },
      ];

      // Set up the mock fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await getUserUrls();

      // Verify fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith("/api/urls");

      // Verify the response matches our mock data
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when API call fails", async () => {
      // Mock a failed fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Expect getUserUrls to throw an error
      await expect(getUserUrls()).rejects.toThrow("Failed to fetch URLs");
    });
  });

  describe("getUserStats", () => {
    it("should return mock stats in development environment", async () => {
      // Set environment to development
      process.env.NODE_ENV = "development";

      const result = await getUserStats();

      // Verify that we got mock stats with expected properties
      expect(result).toHaveProperty("totalUrls");
      expect(result).toHaveProperty("totalClicks");
      expect(result).toHaveProperty("activeUrls");
      expect(result).toHaveProperty("expiredUrls");
      expect(result).toHaveProperty("avgResponseTime");
      expect(result).toHaveProperty("uniqueVisitors");
    });

    it("should fetch stats from API in production environment", async () => {
      // Mock successful fetch response
      const mockStats = {
        totalUrls: 5,
        totalClicks: 100,
        activeUrls: 3,
        expiredUrls: 2,
        avgResponseTime: 200,
        uniqueVisitors: 80,
      };

      // Set up the mock fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStats),
      });

      const result = await getUserStats();

      // Verify fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith("/api/stats");

      // Verify the response matches our mock data
      expect(result).toEqual(mockStats);
    });

    it("should throw an error when API call fails", async () => {
      // Mock a failed fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Expect getUserStats to throw an error
      await expect(getUserStats()).rejects.toThrow("Failed to fetch stats");
    });
  });

  describe("shortenUrl", () => {
    it("should return a shortened URL object with the expected properties", async () => {
      const request: URLShortenRequest = {
        url: "https://example.com/long-url",
      };

      const result = await shortenUrl(request);

      // Verify that the shortened URL has the expected properties
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("shortUrl");
      expect(result).toHaveProperty("originalUrl", request.url);
      expect(result).toHaveProperty("createdAt");
      expect(result).toHaveProperty("clicks", 0);
      expect(result).toHaveProperty("status", "active");
      expect(result).toHaveProperty("qrCode");

      // Verify the shortUrl format
      expect(result.shortUrl).toMatch(/https:\/\/shortking\.com\/.+/);
    });

    it("should handle custom alias in the request", async () => {
      const request: URLShortenRequest = {
        url: "https://example.com/long-url",
        customAlias: "my-custom-alias",
      };

      const result = await shortenUrl(request);

      // Verify that the shortened URL contains the custom alias
      expect(result.shortUrl).toBe("https://shortking.com/my-custom-alias");
    });

    it("should handle expiration time in the request", async () => {
      const request: URLShortenRequest = {
        url: "https://example.com/long-url",
        expiresIn: 24, // 24 hours
      };

      const result = await shortenUrl(request);

      // Verify that expiresAt field exists and is approximately 24 hours in the future
      expect(result.expiresAt).toBeDefined();

      if (result.expiresAt) {
        const expiryTime = new Date(result.expiresAt).getTime();
        const now = Date.now();
        const hoursDiff = (expiryTime - now) / (1000 * 60 * 60);

        // Allow for small timing differences in test execution
        expect(Math.round(hoursDiff)).toBe(24);
      }
    });
  });

  describe("checkUrlSafety", () => {
    it("should call the WebRisk API with the correct parameters", async () => {
      // Mock successful fetch response
      const mockResponse: WebRiskResponse = {};

      // Set up the mock fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const url = "https://example.com";

      await checkUrlSafety(url);

      // Verify that fetch was called
      expect(fetch).toHaveBeenCalled();

      // Get the URL that was passed to fetch
      const fetchUrl = (fetch as any).mock.calls[0][0];

      // Verify that the URL contains the expected parameters
      expect(fetchUrl).toContain(encodeURIComponent(url));
      expect(fetchUrl).toContain("threatTypes=MALWARE");
      expect(fetchUrl).toContain("threatTypes=SOCIAL_ENGINEERING");
      expect(fetchUrl).toContain("threatTypes=UNWANTED_SOFTWARE");
    });

    it("should handle the case when a URL is flagged as unsafe", async () => {
      // Mock a response indicating a threat
      const mockResponse: WebRiskResponse = {
        threat: {
          threatTypes: ["SOCIAL_ENGINEERING"],
          expireTime: new Date().toISOString(),
        },
      };

      // Set up the mock fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await checkUrlSafety("https://malicious-example.com");

      // Verify that the response includes the threat information
      expect(result.threat).toBeDefined();
      expect(result.threat!.threatTypes).toContain("SOCIAL_ENGINEERING");
    });

    it("should handle API errors gracefully", async () => {
      // Mock a console.error to prevent actual console output during tests
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock a failed fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // The function should return an empty object instead of throwing
      const result = await checkUrlSafety("https://example.com");

      // Verify that we got an empty object back
      expect(result).toEqual({});

      // Verify that console.error was called
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Restore the original console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe("updateAlias", () => {
    it("should call the API with the correct parameters", async () => {
      // Mock successful fetch response
      const mockResponse = { success: true };

      // Set up the mock fetch response
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const oldAlias = "old-alias";
      const newAlias = "new-alias";

      await updateAlias(oldAlias, newAlias);

      // Verify that fetch was called with the correct URL and options
      expect(fetch).toHaveBeenCalledWith(`/api/urls/${oldAlias}`, {
        method: "PUT",
        body: JSON.stringify({ newAlias }),
      });
    });

    it("should throw an error when the alias is already in use", async () => {
      // Mock a 400 response indicating the alias is already in use
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      // Expect updateAlias to throw a specific error
      await expect(updateAlias("old-alias", "existing-alias")).rejects.toThrow(
        "Custom alias already in use"
      );
    });

    it("should throw a general error for other API failures", async () => {
      // Mock a 500 response indicating a server error
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      // Expect updateAlias to throw a general error
      await expect(updateAlias("old-alias", "new-alias")).rejects.toThrow(
        "Failed to update alias: 500"
      );
    });
  });
});
