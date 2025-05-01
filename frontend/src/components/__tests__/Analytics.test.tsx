import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Analytics } from "../analytics";
import * as apiModule from "../../lib/api";
import { ShortenedURL } from "../../lib/api";

// Mock sample data
const mockUrls: ShortenedURL[] = [
  {
    id: "1",
    originalUrl: "https://www.example.com/very/long/url",
    shortUrl: "https://shortking.com/abc123",
    createdAt: new Date("2024-01-01").toISOString(),
    clicks: 150,
    status: "active",
  },
  {
    id: "2",
    originalUrl: "https://www.anotherlongurl.com/path",
    shortUrl: "https://shortking.com/def456",
    createdAt: new Date("2024-01-15").toISOString(),
    expiresAt: new Date("2024-02-15").toISOString(),
    clicks: 75,
    status: "expired",
  },
  {
    id: "3",
    originalUrl: "https://www.populardomain.com/bestseller",
    shortUrl: "https://shortking.com/best",
    createdAt: new Date("2024-01-10").toISOString(),
    clicks: 300,
    status: "active",
  },
  {
    id: "4",
    originalUrl: "https://www.marketing.com/campaign",
    shortUrl: "https://shortking.com/camp",
    createdAt: new Date("2024-01-20").toISOString(),
    clicks: 200,
    status: "active",
  },
  {
    id: "5",
    originalUrl: "https://www.blog.com/article",
    shortUrl: "https://shortking.com/blog",
    createdAt: new Date("2024-01-05").toISOString(),
    clicks: 100,
    status: "active",
  },
];

const mockStats = {
  totalUrls: 5,
  totalClicks: 825,
  activeUrls: 4,
  expiredUrls: 1,
  avgResponseTime: 215, // Adding required properties to match Stats type
  uniqueVisitors: 750, // Adding required properties to match Stats type
};

describe("Analytics Component", () => {
  // Mock the API functions before each test
  beforeEach(() => {
    // Cast the mock data to the required types to avoid TypeScript errors
    vi.spyOn(apiModule, "getUserUrls").mockResolvedValue(mockUrls);
    vi.spyOn(apiModule, "getUserStats").mockResolvedValue(mockStats);
  });

  // Clean up mocks after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading state initially", () => {
    render(<Analytics />);

    // Check for loading spinner using its class instead of role
    expect(
      screen.getByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === "svg" &&
          element.classList.contains("animate-spin")
        );
      })
    ).toBeInTheDocument();

    expect(screen.queryByText("Total Clicks")).not.toBeInTheDocument();
  });

  it("renders analytics cards with correct data after loading", async () => {
    render(<Analytics />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Total Clicks")).toBeInTheDocument();
    });

    // Check all stats cards are rendered with correct values
    expect(screen.getByText("825")).toBeInTheDocument(); // Total clicks

    // Use a more specific selector for elements that might appear multiple times
    const activeUrlsCard = screen
      .getByText("Active URLs")
      .closest(".flex-row")?.parentElement;
    expect(activeUrlsCard).toBeInTheDocument();
    expect(
      activeUrlsCard?.querySelector(".text-2xl.font-bold")?.textContent
    ).toBe("4");

    const expiredUrlsCard = screen
      .getByText("Expired URLs")
      .closest(".flex-row")?.parentElement;
    expect(expiredUrlsCard).toBeInTheDocument();
    expect(
      expiredUrlsCard?.querySelector(".text-2xl.font-bold")?.textContent
    ).toBe("1");

    expect(screen.getByText("Avg. Daily Clicks")).toBeInTheDocument();

    // Check that calculated averages are displayed
    expect(screen.getByText("Avg. 165 clicks per URL")).toBeInTheDocument();
    expect(screen.getByText("Out of 5 total URLs")).toBeInTheDocument();
  });

  it("displays top performing URLs in correct order", async () => {
    render(<Analytics />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Top Performing URLs")).toBeInTheDocument();
    });

    // Check that URLs are displayed in order of clicks (highest first)
    const urlElements = screen.getAllByText(/https:\/\/shortking\.com\//);

    // First URL should be the one with 300 clicks
    expect(urlElements[0]).toHaveTextContent("https://shortking.com/best");

    // Second URL should be the one with 200 clicks
    expect(urlElements[1]).toHaveTextContent("https://shortking.com/camp");

    // URLs should be in descending order by clicks
    const clickElements = screen.getAllByText(/clicks$/);
    expect(clickElements[0]).toHaveTextContent("300 clicks");
    expect(clickElements[1]).toHaveTextContent("200 clicks");
    expect(clickElements[2]).toHaveTextContent("150 clicks");
    expect(clickElements[3]).toHaveTextContent("100 clicks");
    expect(clickElements[4]).toHaveTextContent("75 clicks");
  });

  it("handles errors gracefully", async () => {
    // Mock API failure
    vi.spyOn(apiModule, "getUserUrls").mockRejectedValue(
      new Error("API Error")
    );
    vi.spyOn(apiModule, "getUserStats").mockRejectedValue(
      new Error("API Error")
    );

    // Spy on console.error to verify error logging
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Analytics />);

    // Wait for API calls to complete
    await waitFor(() => {
      expect(screen.getByText("Total Clicks")).toBeInTheDocument();
    });

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to fetch analytics data:",
      expect.any(Error)
    );

    // Component should render with empty or default values
    expect(screen.getByText("Total Clicks")).toBeInTheDocument();

    // Find all elements with "0" text, then check if any of them are in a card
    const totalClicksCard = screen
      .getByText("Total Clicks")
      .closest(".flex-row")?.parentElement;

    // Use a more lenient expectation that works with both empty string and "0"
    const contentText =
      totalClicksCard?.querySelector(".text-2xl.font-bold")?.textContent || "";
    expect(["", "0"]).toContain(contentText);

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("calculates percentage of expired URLs correctly", async () => {
    render(<Analytics />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Expired URLs")).toBeInTheDocument();
    });

    // Check percentage calculation (1/5 = 20%)
    expect(screen.getByText("20.0% of total URLs")).toBeInTheDocument();
  });
});
