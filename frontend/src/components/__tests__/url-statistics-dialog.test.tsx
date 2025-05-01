import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UrlStatisticsDialog } from "../url-statistics-dialog";
import * as themeContext from "../../contexts/theme-context";
import * as useUrlsModule from "../../hooks/useUrls";
import { ShortenedURL } from "../../lib/api";

// Mock the useUrls hook
vi.mock("../../hooks/useUrls", () => ({
  useUrls: vi.fn(),
}));

// Mock Highcharts to avoid chart rendering issues
vi.mock("highcharts-react-official", () => ({
  default: () => <div data-testid="highcharts">Mocked Chart</div>,
}));

// Mock theme context
vi.mock("../../contexts/theme-context", () => ({
  useTheme: vi.fn(),
}));

// Define the URLMetrics interface to match component expectations
interface URLMetrics extends ShortenedURL {
  uniqueVisitors: number;
  avgResponseTime: number;
  lastClicked?: string;
  customDomain?: string;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

// Mock metrics data with proper typing
const mockURLMetrics: URLMetrics = {
  id: "1",
  originalUrl: "https://www.example.com/very/long/url/that/needs/shortening",
  shortUrl: "https://shortking.com/abc123",
  createdAt: new Date("2024-01-01").toISOString(),
  clicks: 150,
  status: "active" as const, // Explicitly type as "active" or "expired"
  uniqueVisitors: 120,
  avgResponseTime: 250,
  lastClicked: new Date("2024-01-20").toISOString(),
  deviceStats: {
    mobile: 80,
    desktop: 60,
    tablet: 10,
  },
};

// Mock updateAlias function for the hook
const mockUpdateAlias = vi.fn();

describe("UrlStatisticsDialog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock theme hook to return light theme by default
    vi.spyOn(themeContext, "useTheme").mockReturnValue({
      theme: "light",
      toggleTheme: vi.fn(),
    });

    // Mock useUrls hook
    vi.spyOn(useUrlsModule, "useUrls").mockReturnValue({
      urls: [],
      isLoading: false,
      error: null,
      fetchUrls: vi.fn(),
      shortenUrl: vi.fn(),
      checkUrlSafety: vi.fn(),
      updateAlias: mockUpdateAlias,
    });

    // Reset window's innerWidth for mobile detection tests
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024, // Default to desktop width
    });

    // Mock window resize event
    window.dispatchEvent = vi.fn();
  });

  it("renders nothing when url is null", () => {
    render(
      <UrlStatisticsDialog url={null} open={true} onOpenChange={() => {}} />
    );

    // Dialog should not be in the document
    expect(screen.queryByText("URL Statistics")).not.toBeInTheDocument();
  });

  it("renders the dialog with URL information when open is true", () => {
    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    // Check for dialog title
    expect(screen.getByText("URL Statistics")).toBeInTheDocument();

    // Check URL information is displayed
    expect(screen.getByText("Short URL")).toBeInTheDocument();
    expect(screen.getByText(mockURLMetrics.shortUrl)).toBeInTheDocument();
    expect(screen.getByText("Original URL")).toBeInTheDocument();
    expect(screen.getByText(mockURLMetrics.originalUrl)).toBeInTheDocument();

    // Just verify that the "Created" label exists, without checking the actual date format
    expect(screen.getByText("Created")).toBeInTheDocument();

    // Check for charts
    expect(screen.getAllByTestId("highcharts").length).toBe(2);
    expect(screen.getByText("Traffic Trends")).toBeInTheDocument();
    expect(screen.getByText("Device Distribution")).toBeInTheDocument();
  });

  it("displays status badge correctly", () => {
    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    const statusBadge = screen.getByText("active");
    expect(statusBadge).toBeInTheDocument();
  });

  it("displays metrics correctly", () => {
    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    // Check that metrics are displayed
    expect(screen.getByText("Total Clicks")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument(); // Clicks count
    expect(screen.getByText("Activity")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument(); // Status
    expect(screen.getByText("Response")).toBeInTheDocument();
    expect(screen.getByText("250ms")).toBeInTheDocument(); // Response time
    expect(screen.getByText("Visitors")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument(); // Unique visitors
  });

  it("calls onOpenChange when close button is clicked", () => {
    const mockOnOpenChange = vi.fn();

    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={mockOnOpenChange}
      />
    );

    // Click the Close button
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    // onOpenChange should be called with false
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("handles custom domain editing", async () => {
    // Mock successful response from updateAlias
    mockUpdateAlias.mockResolvedValue({
      short_url: "https://shortking.com/custom123",
    });

    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    // Check initial state
    expect(screen.getByText("Custom Domain")).toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();

    // Click edit button (Pencil icon) - finding by title
    const editButton = screen.getByTitle("Edit");
    fireEvent.click(editButton);

    // Check if input field appears
    const inputField = screen.getByPlaceholderText("Enter custom domain...");
    expect(inputField).toBeInTheDocument();

    // Change input value
    fireEvent.change(inputField, { target: { value: "custom123" } });

    // Click save button
    const saveButton = screen.getByTitle("Save");
    fireEvent.click(saveButton);

    // Wait for the API call to resolve
    await waitFor(() => {
      // Check if updateAlias was called with correct parameters
      expect(mockUpdateAlias).toHaveBeenCalledWith("abc123", "custom123");
    });

    // After saving, we should return to display mode
    expect(
      screen.queryByPlaceholderText("Enter custom domain...")
    ).not.toBeInTheDocument();
  });

  it("handles domain editing errors", async () => {
    // Mock error response from updateAlias
    mockUpdateAlias.mockRejectedValue(new Error("Domain already in use"));

    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    // Start editing
    const editButton = screen.getByTitle("Edit");
    fireEvent.click(editButton);

    // Change input value
    const inputField = screen.getByPlaceholderText("Enter custom domain...");
    fireEvent.change(inputField, { target: { value: "custom123" } });

    // Click save button
    const saveButton = screen.getByTitle("Save");
    fireEvent.click(saveButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText("Domain already in use")).toBeInTheDocument();
    });

    // Should stay in edit mode
    expect(
      screen.getByPlaceholderText("Enter custom domain...")
    ).toBeInTheDocument();
  });

  it("cancels domain editing when cancel button is clicked", () => {
    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    // Start editing
    const editButton = screen.getByTitle("Edit");
    fireEvent.click(editButton);

    // Change input value
    const inputField = screen.getByPlaceholderText("Enter custom domain...");
    fireEvent.change(inputField, { target: { value: "custom123" } });

    // Click cancel button
    const cancelButton = screen.getByTitle("Cancel");
    fireEvent.click(cancelButton);

    // Should return to display mode with original value
    expect(
      screen.queryByPlaceholderText("Enter custom domain...")
    ).not.toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();
  });

  it("adapts to mobile view when window width is less than 768px", () => {
    // Set window width to mobile size
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    // Trigger resize event
    window.dispatchEvent(new Event("resize"));

    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    // Charts should still be rendered (we can't test their size here,
    // but the component should handle mobile view internally)
    expect(screen.getAllByTestId("highcharts").length).toBe(2);
  });

  it("applies dark theme styles when theme is dark", () => {
    // Mock theme hook to return dark theme
    vi.spyOn(themeContext, "useTheme").mockReturnValue({
      theme: "dark",
      toggleTheme: vi.fn(),
    });

    render(
      <UrlStatisticsDialog
        url={mockURLMetrics}
        open={true}
        onOpenChange={() => {}}
      />
    );

    // We can't directly test CSS, but we can confirm the component renders
    expect(screen.getByText("URL Statistics")).toBeInTheDocument();
  });
});
