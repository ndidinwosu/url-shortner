import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getUserStats, getUserUrls, type ShortenedURL } from "../lib/api";
import { Loader2, TrendingUp, Clock, Globe, Users } from "lucide-react";

export function Analytics() {
  const [urls, setUrls] = useState<ShortenedURL[]>([]);
  const [stats, setStats] = useState<{
    totalUrls: number;
    totalClicks: number;
    activeUrls: number;
    expiredUrls: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [urlsData, statsData] = await Promise.all([
          getUserUrls(),
          getUserStats(),
        ]);
        setUrls(urlsData);
        setStats(statsData);
      } catch (error: unknown) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Calculate additional analytics
  const averageClicksPerUrl = stats
    ? Math.round(stats.totalClicks / stats.totalUrls)
    : 0;
  const clicksByDate = urls.reduce((acc, url) => {
    const date = new Date(url.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + url.clicks;
    return acc;
  }, {} as Record<string, number>);

  const topPerformingUrls = [...urls]
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  const avgDailyClicks =
    stats?.totalClicks && Object.keys(clicksByDate).length
      ? Math.round(stats.totalClicks / Object.keys(clicksByDate).length)
      : 0;

  return (
    <div className="w-full space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              Avg. {averageClicksPerUrl} clicks per URL
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active URLs</CardTitle>
            <Globe className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeUrls}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats?.totalUrls} total URLs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expired URLs</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.expiredUrls}</div>
            <p className="text-xs text-muted-foreground">
              {(
                ((stats?.expiredUrls || 0) / (stats?.totalUrls || 1)) *
                100
              ).toFixed(1)}
              % of total URLs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Daily Clicks
            </CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDailyClicks}</div>
            <p className="text-xs text-muted-foreground">
              Across {Object.keys(clicksByDate).length} days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing URLs */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing URLs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {topPerformingUrls.map((url, index) => (
              <div key={url.shortUrl} className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {index + 1}
                </div>
                <div className="ml-4 space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">
                    {url.shortUrl}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {url.originalUrl}
                  </p>
                </div>
                <div className="ml-auto font-medium">{url.clicks} clicks</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
