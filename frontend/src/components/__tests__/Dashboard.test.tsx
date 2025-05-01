import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Dashboard } from "../Dashboard";
import * as urlsHook from "../../hooks/useUrls";
import * as statsHook from "../../hooks/useStats";
import * as themeContext from "../../contexts/theme-context";
import { URLMetrics } from "../../lib/api";

// Mock the Highcharts component
vi.mock("highcharts-react-official", () => ({
  default: vi
    .fn()
    .mockImplementation(({ options }) => (
      <div
        data-testid={`chart-${options.title.text
          .replace(/\s+/g, "-")
          .toLowerCase()}`}
      >
        Chart: {options.title.text}
      </div>
    )),
}));

// Mock the URL statistics dialog
vi.mock("../url-statistics-dialog", () => ({
  UrlStatisticsDialog: vi
    .fn()
    .mockImplementation(({ url, open }) =>
      open ? (
        <div data-testid="url-statistics-dialog">
          URL Statistics for {url?.shortUrl}
        </div>
      ) : null
    ),
}));

// Sample mock data
const mockUrls: URLMetrics[] = [
  {
    id: "1",
    originalUrl: "https://www.example.com/very/long/url",
    shortUrl: "https://shortking.com/abc123",
    createdAt: new Date("2024-01-01").toISOString(),
    clicks: 150,
    status: "active",
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
  {
    id: "2",
    originalUrl: "https://www.anotherlongurl.com/path",
    shortUrl: "https://shortking.com/def456",
    createdAt: new Date("2024-01-15").toISOString(),
    expiresAt: new Date("2024-02-15").toISOString(),
    clicks: 75,
    status: "expired",
    uniqueVisitors: 65,
    avgResponseTime: 180,
    lastClicked: new Date("2024-01-25").toISOString(),
    deviceStats: {
      mobile: 40,
      desktop: 25,
      tablet: 10,
    },
    locationStats: {
      "United States": 35,
      "United Kingdom": 20,
      Canada: 10,
      Others: 10,
    },
    referrerStats: {
      Direct: 25,
      Google: 20,
      Twitter: 15,
      Others: 15,
    },
  },
];

const mockStats = {
  totalUrls: 2,
  totalClicks: 225,
  activeUrls: 1,
  expiredUrls: 1,
  avgResponseTime: 215,
  uniqueVisitors: 185,
};

// Mock the global window.innerWidth
Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1024, // Default to desktop width
});

// Mock the resize event
const mockResizeEvent = () => {
  window.dispatchEvent(new Event("resize"));
};

describe("Dashboard Component", () => {
  // Setup mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock theme context
    vi.spyOn(themeContext, "useTheme").mockImplementation(() => ({
      theme: "light",
      toggleTheme: vi.fn(),
      // Additional properties that might be used
      isPaidVersion: false,
      toggleVersion: vi.fn(),
    }));

    // Mock useUrls hook
    vi.spyOn(urlsHook, "useUrls").mockImplementation(() => ({
      urls: mockUrls,
      isLoading: false,
      error: null,
      fetchUrls: vi.fn(),
      shortenUrl: vi.fn(),
      checkUrlSafety: vi.fn(),
      updateAlias: vi.fn(),
    }));

    // Mock useStats hook
    vi.spyOn(statsHook, "useStats").mockImplementation(() => ({
      stats: mockStats,
      isLoading: false,
      error: null,
      fetchStats: vi.fn(),
    }));
  });

  it("renders the dashboard with metrics cards", () => {
    render(<Dashboard />);

    // Check metric cards are rendered
    expect(screen.getByText("Total Clicks")).toBeInTheDocument();
    expect(screen.getByText("Active URLs")).toBeInTheDocument();
    expect(screen.getByText("Avg. Response")).toBeInTheDocument();
    expect(screen.getByText("Unique Visitors")).toBeInTheDocument();

    // Check metric values
    expect(screen.getByText("225")).toBeInTheDocument(); // Total clicks
    expect(screen.getByText("1")).toBeInTheDocument(); // Active URLs
    expect(screen.getByText("215ms")).toBeInTheDocument(); // Avg response time
    expect(screen.getByText("185")).toBeInTheDocument(); // Unique visitors
  });

  it("renders charts correctly", () => {
    render(<Dashboard />);

    // Check charts are rendered
    expect(screen.getByTestId("chart-traffic-overview")).toBeInTheDocument();
    expect(screen.getByTestId("chart-device-distribution")).toBeInTheDocument();
  });

  it("renders the URL table with correct data", () => {
    render(<Dashboard />);

    // Check table headers
    expect(screen.getByText("Short URL")).toBeInTheDocument();
    expect(screen.getByText("Clicks")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check table data
    expect(
      screen.getByText("https://shortking.com/abc123")
    ).toBeInTheDocument();
    expect(
      screen.getByText("https://shortking.com/def456")
    ).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("expired")).toBeInTheDocument();
  });

  it("shows loading spinner when data is loading", () => {
    // Mock loading state
    vi.spyOn(urlsHook, "useUrls").mockImplementation(() => ({
      urls: [],
      isLoading: true,
      error: null,
      fetchUrls: vi.fn(),
      shortenUrl: vi.fn(),
      checkUrlSafety: vi.fn(),
      updateAlias: vi.fn(),
    }));

    render(<Dashboard />);

    // Loading spinner should be visible
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    // Dashboard content should not be visible
    expect(screen.queryByText("Total Clicks")).not.toBeInTheDocument();
  });

  it("opens URL statistics dialog when clicking on a table row", async () => {
    render(<Dashboard />);

    // Find and click the first table row
    const firstRow = screen
      .getByText("https://shortking.com/abc123")
      .closest("tr");
    if (firstRow) {
      fireEvent.click(firstRow);
    }

    // Dialog should be open with the correct URL
    await waitFor(() => {
      expect(screen.getByTestId("url-statistics-dialog")).toBeInTheDocument();
      expect(
        screen.getByText(/URL Statistics for https:\/\/shortking.com\/abc123/)
      ).toBeInTheDocument();
    });
  });

  it("adapts to mobile screen size", () => {
    // Set window inner width to mobile size
    window.innerWidth = 500;
    mockResizeEvent();

    render(<Dashboard />);

    // Mobile optimized table should have fewer columns
    expect(screen.getByText("Short URL")).toBeInTheDocument();
    expect(screen.getByText("Clicks")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Visitors column should not be visible on mobile
    expect(screen.queryByText("Visitors")).not.toBeInTheDocument();
  });

  it("handles theme changes", () => {
    // Mock dark theme
    vi.spyOn(themeContext, "useTheme").mockImplementation(() => ({
      theme: "dark",
      toggleTheme: vi.fn(),
      isPaidVersion: false,
      toggleVersion: vi.fn(),
    }));

    render(<Dashboard />);

    // Component should render correctly with dark theme settings
    expect(screen.getByText("Total Clicks")).toBeInTheDocument();
    expect(screen.getByTestId("chart-traffic-overview")).toBeInTheDocument();
  });
});
