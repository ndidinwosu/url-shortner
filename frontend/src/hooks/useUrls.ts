import { useState, useCallback, useEffect } from "react";
import { apiClient } from "../lib/api-client";
import type { ShortenedURL, URLMetrics, URLShortenRequest } from "../lib/api";
const BASE_URL = "https://url-shortner-550088723352.us-central1.run.app";

// Mock data
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

const WEBRISK_API_KEY = import.meta.env.VITE_WEBRISK_API_KEY;

interface WebRiskResponse {
  threat?: {
    threatTypes: string[];
    expireTime: string;
  };
}

interface APIURLMetrics {
  id: string;
  short_url: string;
  original_url: string;
  clicks: number;
  created_at: string;
  status: "active" | "expired";
  expires_at: string | null;
  unique_visitors: number;
  avg_response_time: number;
  last_clicked: string | null;
  device_stats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  location_stats: Record<string, number>;
  referrer_stats: Record<string, number>;
}

interface APIResponse {
  id: string;
  short_url: string;
  original_url: string;
  clicks: number;
  created_at: string;
  status: "active" | "expired";
  expires_at: string | null;
  qr_code?: string;
}

export function useUrls() {
  const [urls, setUrls] = useState<URLMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<APIURLMetrics[]>("/urls");

      const transformedUrls: URLMetrics[] = response.data.map((url) => ({
        id: url.id,
        shortUrl: url.short_url,
        originalUrl: url.original_url,
        clicks: url.clicks,
        createdAt: url.created_at,
        status: url.status,
        expiresAt: url.expires_at || undefined,
        uniqueVisitors: url.unique_visitors,
        avgResponseTime: url.avg_response_time,
        lastClicked: url.last_clicked || undefined,
        deviceStats: url.device_stats,
        locationStats: url.location_stats,
        referrerStats: url.referrer_stats,
      }));

      setUrls(transformedUrls);
    } catch (err) {
      console.error("fetchUrls error:", err);
      setError("Failed to fetch URLs");
    } finally {
      setIsLoading(false);
    }
  }, []); // 空依賴陣列，確保函數只創建一次

  useEffect(() => {
    fetchUrls();
  }, []); // 初始加載時執行一次

  const shortenUrl = async (
    request: URLShortenRequest
  ): Promise<ShortenedURL> => {
    try {
      // 根據是否登入使用不同的端點
      if (localStorage.getItem("auth_token")) {
        // 已登入用戶使用 /urls 端點，可以使用完整功能
        const response = await apiClient.post<APIResponse>("/urls", request);
        // 轉換資料格式
        return {
          id: response.data.id,
          shortUrl: response.data.short_url,
          originalUrl: response.data.original_url,
          clicks: response.data.clicks,
          createdAt: response.data.created_at,
          status: response.data.status,
          expiresAt: response.data.expires_at || undefined,
          qrCode: response.data.qr_code || undefined,
        };
      } else {
        // 未登入用戶使用 /shorten 端點，只能使用基本功能
        const response = await apiClient.post<APIResponse>("/shorten", {
          url: request.url,
        });
        // 轉換資料格式
        return {
          id: response.data.id,
          shortUrl: response.data.short_url,
          originalUrl: response.data.original_url,
          clicks: response.data.clicks,
          createdAt: response.data.created_at,
          status: response.data.status,
          expiresAt: response.data.expires_at || undefined,
          qrCode: response.data.qr_code || undefined,
        };
      }
    } catch (error) {
      throw error;
    }
  };

  const updateAlias = async (alias: string, newAlias: string) => {
    try {
      const response = await apiClient.put<APIResponse>(
        `/urls/${alias}?new_alias=${newAlias}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const checkUrlSafety = async (url: string): Promise<WebRiskResponse> => {
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

  return {
    urls,
    isLoading,
    error,
    fetchUrls,
    shortenUrl,
    checkUrlSafety,
    updateAlias,
  };
}
