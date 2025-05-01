import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/api-client";
import type { Stats } from "../lib/api";

interface APIStats {
  total_urls: number;
  total_clicks: number;
  active_urls: number;
  expired_urls: number;
  avg_response_time: number;
  unique_visitors: number;
}

const mockStats: Stats = {
  totalUrls: 2,
  totalClicks: 225,
  activeUrls: 1,
  expiredUrls: 1,
  avgResponseTime: 215,
  uniqueVisitors: 185,
};

export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<APIStats>("/stats");

      const transformedStats: Stats = {
        totalUrls: response.data.total_urls,
        totalClicks: response.data.total_clicks,
        activeUrls: response.data.active_urls,
        expiredUrls: response.data.expired_urls,
        avgResponseTime: response.data.avg_response_time,
        uniqueVisitors: response.data.unique_visitors,
      };

      setStats(transformedStats);
    } catch (err) {
      console.error("fetchStats error:", err);
      setError("Failed to fetch stats");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  };
}
