import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  TrendingUp,
  Clock,
  Globe,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Save,
  ExternalLink,
  X,
  Link2,
  Calendar,
  LinkIcon,
  ActivityIcon,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { ShortenedURL } from "../lib/api"; // Import ShortenedURL from API
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge"; // Make sure you have this component in your UI library
import { useUrls } from "../hooks/useUrls";

// Update the URLMetrics interface to match what's expected from the API
interface URLMetrics extends ShortenedURL {
  uniqueVisitors: number;
  avgResponseTime: number;
  // lastClicked can be undefined from the API
  lastClicked?: string;
  customDomain?: string;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

interface UrlStatisticsDialogProps {
  url: URLMetrics | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UrlStatisticsDialog({
  url,
  open,
  onOpenChange,
}: UrlStatisticsDialogProps) {
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const [urlMetrics, setUrlMetrics] = useState<URLMetrics>({} as URLMetrics);
  const [isEditingDomain, setIsEditingDomain] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [domainError, setDomainError] = useState("");
  const { updateAlias } = useUrls();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Track viewport width for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset states when dialog opens or URL changes
  useEffect(() => {
    if (open && url) {
      setIsEditingDomain(false);
      setCustomDomain(
        url?.shortUrl.split("/")[url?.shortUrl.split("/").length - 1] || ""
      );
      setDomainError("");
      setUrlMetrics(url);
    }
  }, [open, url]);

  if (!url) {
    return null;
  }

  // Function to handle saving the custom domain
  const handleSaveDomain = async () => {
    try {
      const response = await updateAlias(
        urlMetrics?.shortUrl.split("/")[
          urlMetrics?.shortUrl.split("/").length - 1
        ] || "",
        customDomain
      );
      setDomainError("");
      setIsEditingDomain(false);
      setUrlMetrics({
        ...urlMetrics,
        shortUrl: response.short_url,
      });
    } catch (error) {
      if (error instanceof Error) {
        setDomainError(error.message);
      } else {
        setDomainError("An unknown error occurred");
      }
    }
  };

  // Cancel editing and revert to original value
  const handleCancelEdit = () => {
    setCustomDomain(
      urlMetrics?.shortUrl.split("/")[
        urlMetrics?.shortUrl.split("/").length - 1
      ] || ""
    );
    setDomainError("");
    setIsEditingDomain(false);
  };

  // Use a safe date for lastClicked if it's undefined
  const lastClickedDate = urlMetrics?.lastClicked
    ? new Date(urlMetrics?.lastClicked)
    : new Date();

  // Default mock data for charts if real data is missing or empty
  const mockDeviceStats = {
    mobile: 65,
    desktop: 30,
    tablet: 5,
  };

  // Use provided data or fallback to mock data
  const deviceStats =
    Object.keys(urlMetrics?.deviceStats || {}).length > 0
      ? urlMetrics?.deviceStats
      : mockDeviceStats;

  // Chart configurations with Spotify theme colors
  const chartTheme = {
    backgroundColor: "transparent",
    textColor: isDarkTheme ? "#ffffff" : "#121212",
    gridColor: isDarkTheme ? "#333333" : "#e5e5e5",
    primaryColor: "#1DB954", // Spotify green
    secondaryColor: "#535353", // Dark gray
  };

  // URL-specific traffic over time (mock data for demonstration)
  const clicksOverTimeOptions: Highcharts.Options = {
    title: {
      text: "",
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
        data: [
          // Use safe creation date
          [new Date(url.createdAt).getTime(), 0],
          // Use safe last clicked date
          [lastClickedDate.getTime(), url.clicks],
        ],
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
      enabled: !isMobile,
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

  // Device distribution for this URL
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
      text: "",
      style: { color: chartTheme.textColor },
    },
    series: [
      {
        type: "pie",
        name: "Devices",
        data: Object.entries(deviceStats).map(([device, count], index) => ({
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
      enabled: !isMobile,
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
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: true,
                  format: "<b>{point.name}</b>: {point.percentage:.1f}%",
                },
              },
            },
          },
        },
      ],
    },
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[60]" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[95vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] overflow-y-auto rounded-xl bg-card p-3 sm:p-4 md:p-6 shadow-lg focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] z-[61]">
          {/* URL Header with Status Badge */}
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <Dialog.Title className="text-base sm:text-lg md:text-xl font-medium text-foreground">
                URL Statistics
              </Dialog.Title>
              <Badge
                className={`ml-1 sm:ml-2 text-xs ${
                  urlMetrics?.status === "active"
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                }`}
              >
                {urlMetrics?.status}
              </Badge>
            </div>
            <Dialog.Close asChild>
              <button className="rounded-full p-1 sm:p-1.5 text-muted-foreground hover:bg-muted focus:outline-none">
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* URL Info Card */}
          <Card className="border-border/10 bg-card/50 mb-4 md:mb-6 overflow-hidden">
            <CardContent className="p-3 sm:p-4">
              {/* URL and Creation Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                {/* Short URL */}
                <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-foreground">
                      Short URL
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs sm:text-sm font-mono text-muted-foreground truncate max-w-[180px] sm:max-w-none">
                        {urlMetrics?.shortUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(urlMetrics?.shortUrl, "_blank")
                        }
                        className="h-5 w-5 text-primary hover:text-primary/80 min-h-[20px] min-w-[20px]"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-foreground">
                      Created
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      {new Date(urlMetrics.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Original URL */}
                <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors md:col-span-2">
                  <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5" />
                  <div className="w-full">
                    <h3 className="text-xs sm:text-sm font-medium text-foreground">
                      Original URL
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs sm:text-sm font-mono text-muted-foreground break-all">
                        {urlMetrics?.originalUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          window.open(urlMetrics?.originalUrl, "_blank")
                        }
                        className="h-5 w-5 text-primary hover:text-primary/80 flex-shrink-0 min-h-[20px] min-w-[20px]"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Custom Domain */}
                <div className="flex items-start gap-2 sm:gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5" />
                  <div className="w-full">
                    <h3 className="text-xs sm:text-sm font-medium text-foreground">
                      Custom Domain
                    </h3>
                    {isEditingDomain ? (
                      <div className="mt-1">
                        <div className="flex items-center gap-2">
                          <Input
                            value={customDomain}
                            onChange={(e) => {
                              setCustomDomain(e.target.value);
                              setDomainError("");
                            }}
                            placeholder="Enter custom domain..."
                            className={`h-7 text-xs sm:text-sm text-foreground ${
                              domainError ? "border-red-500" : ""
                            }`}
                          />
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 sm:h-6 sm:w-6 text-primary hover:text-primary/80 min-h-[20px] min-w-[20px]"
                              onClick={handleSaveDomain}
                              title="Save"
                            >
                              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground hover:text-foreground min-h-[20px] min-w-[20px]"
                              onClick={handleCancelEdit}
                              title="Cancel"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        {domainError && (
                          <p className="text-xs text-red-500 mt-1">
                            {domainError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <span
                          className={`text-xs sm:text-sm font-mono ${
                            !customDomain
                              ? "text-muted-foreground italic"
                              : "text-muted-foreground"
                          }`}
                        >
                          {customDomain || "No custom domain set"}
                        </span>
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 sm:h-6 sm:w-6 text-primary hover:text-primary/80 min-h-[20px] min-w-[20px]"
                            onClick={() => setIsEditingDomain(true)}
                            title="Edit"
                          >
                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          {customDomain && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                window.open(urlMetrics?.shortUrl, "_blank")
                              }
                              className="h-5 w-5 sm:h-6 sm:w-6 text-primary hover:text-primary/80 min-h-[20px] min-w-[20px]"
                              title="Visit custom domain"
                            >
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 md:mb-6">
            <MetricCard
              title="Total Clicks"
              value={urlMetrics?.clicks}
              trend={+15}
              icon={<TrendingUp className="h-4 w-4 text-primary" />}
            />
            <MetricCard
              title="Activity"
              value={urlMetrics?.status === "active" ? "Active" : "Inactive"}
              trend={urlMetrics?.status === "active" ? +5 : -5}
              icon={<ActivityIcon className="h-4 w-4 text-primary" />}
            />
            <MetricCard
              title="Response"
              value={`${(urlMetrics?.avgResponseTime || 0).toFixed(0)}ms`}
              trend={-8}
              icon={<Clock className="h-4 w-4 text-primary" />}
            />
            <MetricCard
              title="Visitors"
              value={urlMetrics?.uniqueVisitors}
              trend={+12}
              icon={<Users className="h-4 w-4 text-primary" />}
            />
          </div>

          {/* Charts */}
          <div className="space-y-4 sm:space-y-6 mb-4 md:mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Card className="border-border/10 bg-card hover:bg-card/90 transition-colors overflow-hidden">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm md:text-base text-foreground">
                    Traffic Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-1 sm:p-3">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={clicksOverTimeOptions}
                  />
                </CardContent>
              </Card>
              <Card className="border-border/10 bg-card hover:bg-card/90 transition-colors overflow-hidden">
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-xs sm:text-sm md:text-base text-foreground">
                    Device Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-1 sm:p-3">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={deviceDistributionOptions}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs sm:text-sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Metric Card Component - reused from Dashboard
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
      <CardHeader className="flex flex-row items-center justify-between p-2 sm:p-3 sm:pb-2 pb-1">
        <CardTitle className="text-xs sm:text-sm font-medium text-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-2 sm:p-3 pt-0 sm:pt-0">
        <div className="text-base sm:text-lg md:text-xl font-bold text-foreground">
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
