// Google WebRisk API key
const WEBRISK_API_KEY = import.meta.env.VITE_WEBRISK_API_KEY; // Use Vite env in the browser (frontend)

// Interface for WebRisk API response
export interface WebRiskResponse {
  threat?: {
    threatTypes: string[];
    expireTime: string;
  };
}

// 基本 URL 介面
export interface ShortenedURL {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  status: "active" | "expired";
  expiresAt?: string;
  qrCode?: string;
}

// 擴展的 URL 指標介面
export interface URLMetrics extends ShortenedURL {
  uniqueVisitors: number;
  avgResponseTime: number;
  lastClicked?: string;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  locationStats: Record<string, number>;
  referrerStats: Record<string, number>;
}

export interface URLShortenRequest {
  url: string;
  customAlias?: string;
  expiresIn?: number; // in hours
}

export interface Stats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiredUrls: number;
  avgResponseTime: number;
  uniqueVisitors: number;
}

// Mock data for demonstration
const mockUrlMetrics: URLMetrics[] = [
  {
    id: "1",
    originalUrl: "https://www.example.com/very/long/url/that/needs/shortening",
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
    originalUrl: "https://www.anotherlongurl.com/path/to/something",
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

// 統一的 API 函數
export const getUserUrls = async (): Promise<URLMetrics[]> => {
  // 如果在開發環境使用 mock 資料
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUrlMetrics;
  }

  // 實際的 API 呼叫
  const response = await fetch("/api/urls");
  if (!response.ok) {
    throw new Error("Failed to fetch URLs");
  }
  return response.json();
};

export const getUserStats = async (): Promise<Stats> => {
  // 如果在開發環境使用 mock 資料
  if (process.env.NODE_ENV === "development") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      totalUrls: mockUrlMetrics.length,
      totalClicks: mockUrlMetrics.reduce((acc, url) => acc + url.clicks, 0),
      activeUrls: mockUrlMetrics.filter((url) => url.status === "active")
        .length,
      expiredUrls: mockUrlMetrics.filter((url) => url.status === "expired")
        .length,
      avgResponseTime:
        mockUrlMetrics.reduce((acc, url) => acc + url.avgResponseTime, 0) /
        mockUrlMetrics.length,
      uniqueVisitors: mockUrlMetrics.reduce(
        (acc, url) => acc + url.uniqueVisitors,
        0
      ),
    };
  }

  // 實際的 API 呼叫
  const response = await fetch("/api/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch stats");
  }
  return response.json();
};

// Check if a URL is safe using Google WebRisk API
export const checkUrlSafety = async (url: string): Promise<WebRiskResponse> => {
  try {
    // Encode the URL for the API request
    const encodedUrl = encodeURIComponent(url);
    // Define the threat types to check for
    const threatTypes = [
      "MALWARE",
      "SOCIAL_ENGINEERING",
      "UNWANTED_SOFTWARE",
      "SOCIAL_ENGINEERING_EXTENDED_COVERAGE",
    ];

    // Construct the query parameters
    const threatTypesParams = threatTypes
      .map((type) => `threatTypes=${type}`)
      .join("&");

    // Construct the full API URL
    const apiUrl = `https://webrisk.googleapis.com/v1/uris:search?${threatTypesParams}&uri=${encodedUrl}&key=${WEBRISK_API_KEY}`;

    // Make the request to the WebRisk API
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`WebRisk API error: ${response.status}`);
    }

    // Parse and return the response
    return await response.json();
  } catch (error) {
    console.error("Error checking URL safety:", error);
    // Return empty object if there's an error
    return {};
  }
};

export const shortenUrl = async (
  request: URLShortenRequest
): Promise<ShortenedURL> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const shortCode = Math.random().toString(36).substring(7);
  const id = Math.random().toString(36).substring(7);
  const shortUrl = `https://shortking.com/${request.customAlias || shortCode}`;

  // Generate a mock QR code URL for the shortened URL (in a real app, this would call a QR code generation service)
  // For this example, we're using a placeholder QR code service
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    shortUrl
  )}`;

  return {
    id,
    originalUrl: request.url,
    shortUrl,
    createdAt: new Date().toISOString(),
    expiresAt: request.expiresIn
      ? new Date(Date.now() + request.expiresIn * 3600000).toISOString()
      : undefined,
    clicks: 0,
    status: "active",
    qrCode, // Include the QR code in the response
  };
};

export const updateAlias = async (alias: string, newAlias: string) => {
  const response = await fetch(`/api/urls/${alias}`, {
    method: "PUT",
    body: JSON.stringify({ newAlias }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      // Handle the case where the alias already exists
      throw new Error("Custom alias already in use");
    }
    // Handle other error cases
    throw new Error(`Failed to update alias: ${response.status}`);
  }

  return response.json();
};
