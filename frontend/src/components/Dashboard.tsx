import { useEffect, useState } from "react";
import { getUserStats, getUserUrls, type ShortenedURL } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Loader2,
  TrendingUp,
  Clock,
  Globe,
  Users,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  ArrowUpDown,
} from "lucide-react";
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useUrls } from "../hooks/useUrls";
import { useStats } from "../hooks/useStats";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useTheme } from "../contexts/theme-context";
import { UrlStatisticsDialog } from "./url-statistics-dialog";
import { Container } from "./layout/Container";

interface Stats {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiredUrls: number;
  avgResponseTime: number;
  uniqueVisitors: number;
}

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
  locationStats: Record<string, number>;
  referrerStats: Record<string, number>;
}

export function Dashboard() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";

  const { urls, isLoading: urlsLoading } = useUrls();
  const { stats, isLoading: statsLoading } = useStats();

  const [selectedUrl, setSelectedUrl] = useState<URLMetrics | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Table configuration
  const columnHelper = createColumnHelper<URLMetrics>();
  const columns = [
    columnHelper.accessor("shortUrl", {
      header: "Short URL",
      cell: (info) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
            {info.getValue()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              window.open(info.getValue(), "_blank");
            }}
            className="h-6 w-6 text-primary hover:text-primary/80 min-h-[32px] min-w-[32px]"
          >
            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      ),
    }),
    columnHelper.accessor("clicks", {
      header: "Clicks",
      cell: (info) => (
        <div className="flex items-center gap-1">
          {info.getValue()}
          <span
            className={
              info.getValue() > 100 ? "text-primary" : "text-yellow-500"
            }
          >
            {info.getValue() > 100 ? (
              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor("uniqueVisitors", {
      header: "Visitors",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("avgResponseTime", {
      header: "Response",
      cell: (info) => (
        <span className="whitespace-nowrap">{`${info
          .getValue()
          .toFixed(0)}ms`}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            info.getValue() === "active"
              ? "bg-primary/20 text-primary"
              : "bg-yellow-500/20 text-yellow-500"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("lastClicked", {
      header: "Last Clicked",
      cell: (info) => {
        const lastClickedDate = info.getValue();
        return lastClickedDate
          ? new Date(lastClickedDate).toLocaleDateString()
          : "Never";
      },
    }),
  ];

  // Mobile optimized columns (fewer columns for small screens)
  const mobileColumns = [
    columns[0], // shortUrl
    columns[1], // clicks
    columns[4], // status
  ];

  // Use different columns based on viewport width
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeColumns = isMobile ? mobileColumns : columns;

  const table = useReactTable({
    data: urls,
    columns: activeColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Chart configurations with Spotify theme colors
  const chartTheme = {
    backgroundColor: "transparent",
    textColor: isDarkTheme ? "#ffffff" : "#121212",
    gridColor: isDarkTheme ? "#333333" : "#e5e5e5",
    primaryColor: "#1DB954", // Spotify green
    secondaryColor: "#535353", // Dark gray
  };

  const clicksOverTimeOptions: Highcharts.Options = {
    title: {
      text: "Traffic Overview",
      style: { color: chartTheme.textColor },
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Date",
        style: { color: chartTheme.textColor },
      },
      labels: {
        style: { color: chartTheme.textColor },
      },
      gridLineColor: chartTheme.gridColor,
    },
    yAxis: {
      title: {
        text: "Clicks",
        style: { color: chartTheme.textColor },
      },
      labels: {
        style: { color: chartTheme.textColor },
      },
      gridLineColor: chartTheme.gridColor,
    },
    series: [
      {
        type: "area",
        name: "Total Clicks",
        data: urls.map((url) => [
          new Date(url.createdAt).getTime(),
          url.clicks,
        ]),
        color: chartTheme.primaryColor,
        fillOpacity: 0.3,
      },
    ],
    chart: {
      style: {
        fontFamily: "inherit",
      },
      backgroundColor: chartTheme.backgroundColor,
      height: isMobile ? 200 : 300,
    },
    legend: {
      itemStyle: {
        color: chartTheme.textColor,
      },
    },
    tooltip: {
      backgroundColor: isDarkTheme ? "#333333" : "#ffffff",
      style: {
        color: isDarkTheme ? "#ffffff" : "#121212",
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
            yAxis: {
              title: {
                text: null,
              },
            },
          },
        },
      ],
    },
  };

  const deviceDistributionOptions: Highcharts.Options = {
    chart: {
      type: "pie",
      style: {
        fontFamily: "inherit",
      },
      backgroundColor: chartTheme.backgroundColor,
      height: isMobile ? 200 : 300,
    },
    title: {
      text: "Device Distribution",
      style: { color: chartTheme.textColor },
    },
    series: [
      {
        type: "pie",
        name: "Devices",
        data: Object.entries(
          urls.reduce((acc, url) => {
            Object.entries(url.deviceStats || {}).forEach(([device, count]) => {
              acc[device] = (acc[device] || 0) + count;
            });
            return acc;
          }, {} as Record<string, number>)
        ).map(([device, count], index) => ({
          name: device,
          y: count,
          color:
            index === 0
              ? chartTheme.primaryColor
              : index === 1
              ? chartTheme.secondaryColor
              : "#818181",
        })),
      },
    ],
    legend: {
      itemStyle: {
        color: chartTheme.textColor,
      },
    },
    tooltip: {
      backgroundColor: isDarkTheme ? "#333333" : "#ffffff",
      style: {
        color: isDarkTheme ? "#ffffff" : "#121212",
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
  };

  if (urlsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Helper function to ensure we have valid data for the dialog
  const handleRowClick = (row: any) => {
    // Default mock data
    const mockDeviceStats = {
      mobile: 65,
      desktop: 30,
      tablet: 5,
    };

    const mockLocationStats = {
      "United States": 45,
      "United Kingdom": 20,
      Canada: 15,
      Germany: 10,
      Japan: 5,
      Others: 5,
    };

    const mockReferrerStats = {
      Direct: 30,
      Google: 25,
      Twitter: 20,
      Facebook: 15,
      LinkedIn: 7,
      Others: 3,
    };

    // Create a safe copy of the URL data with default values for potentially undefined fields
    const safeUrl = {
      ...row.original,
      lastClicked: row.original.lastClicked || new Date().toISOString(), // Default to current date if undefined
      uniqueVisitors:
        row.original.uniqueVisitors || Math.floor(row.original.clicks * 0.8), // Estimate unique visitors as 80% of clicks
      avgResponseTime: row.original.avgResponseTime || 250, // Default avg response time
      customDomain: row.original.customDomain || "", // Default empty string for custom domain
      deviceStats: row.original.deviceStats || mockDeviceStats,
      locationStats: row.original.locationStats || mockLocationStats,
      referrerStats: row.original.referrerStats || mockReferrerStats,
    };

    setSelectedUrl(safeUrl as URLMetrics);
    setDialogOpen(true);
  };

  return (
    <Container className="py-4 sm:py-6 md:py-8">
      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <MetricCard
            title="Total Clicks"
            value={stats?.totalClicks ?? 0}
            trend={+15}
            icon={<TrendingUp className="h-4 w-4 text-primary" />}
          />
          <MetricCard
            title="Active URLs"
            value={stats?.activeUrls || 0}
            trend={+5}
            icon={<Globe className="h-4 w-4 text-primary" />}
          />
          <MetricCard
            title="Avg. Response"
            value={`${(stats?.avgResponseTime || 0).toFixed(0)}ms`}
            trend={-8}
            icon={<Clock className="h-4 w-4 text-primary" />}
          />
          <MetricCard
            title="Unique Visitors"
            value={stats?.uniqueVisitors || 0}
            trend={+12}
            icon={<Users className="h-4 w-4 text-primary" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-border/10 bg-card hover:bg-card/90 transition-colors overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg text-foreground">
                Traffic Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
              <HighchartsReact
                highcharts={Highcharts}
                options={clicksOverTimeOptions}
              />
            </CardContent>
          </Card>
          <Card className="border-border/10 bg-card hover:bg-card/90 transition-colors overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-sm sm:text-base md:text-lg text-foreground">
                Device Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
              <HighchartsReact
                highcharts={Highcharts}
                options={deviceDistributionOptions}
              />
            </CardContent>
          </Card>
        </div>

        {/* URLs Table */}
        <Card className="border-border/10 bg-card hover:bg-card/90 transition-colors overflow-hidden">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-sm sm:text-base md:text-lg text-foreground">
              URL Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/10">
                <thead className="bg-muted/50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => header.column.toggleSorting()}
                                className="h-5 w-5"
                              >
                                <ArrowUpDown className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-border/10">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-muted/20 cursor-pointer"
                      onClick={() => handleRowClick(row)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-foreground"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <UrlStatisticsDialog
          url={selectedUrl}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </Container>
  );
}

// Metric Card Component
function MetricCard({
  title,
  value,
  trend,
  icon,
}: {
  title: string;
  value: number | string;
  trend: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="border-border/10 bg-card hover:bg-card/90 transition-colors overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4 pb-1 sm:pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
        <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
          {value}
        </div>
        <p
          className={`text-[10px] sm:text-xs ${
            trend > 0 ? "text-primary" : "text-red-500"
          } flex items-center gap-1`}
        >
          {trend > 0 ? (
            <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
          {Math.abs(trend)}% from last period
        </p>
      </CardContent>
    </Card>
  );
}
