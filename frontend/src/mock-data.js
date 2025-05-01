// User related mock data
export const mockUser = {
  id: "1",
  email: "testuser@example.com",
  password: "test1234", // In real app, never store plain text passwords
  name: "Test User",
  createdAt: "2024-01-01T00:00:00.000Z",
  isPremium: false,
};

// URL Metrics mock data
export const mockUrlMetrics = [
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

// Stats mock data
export const mockStats = {
  totalUrls: 2,
  totalClicks: 225,
  activeUrls: 1,
  expiredUrls: 1,
  avgResponseTime: 215,
  uniqueVisitors: 185,
};

// User preferences mock data
export const mockPreferences = {
  theme: "light",
  defaultExpiryDays: 30,
  emailNotifications: true,
  customDomain: null,
};

// QR Code templates mock data
export const mockQRTemplates = [
  {
    id: "1",
    name: "Basic",
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    cornerSquareStyle: "square",
    cornerDotStyle: "square",
  },
  {
    id: "2",
    name: "Rounded",
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    cornerSquareStyle: "rounded",
    cornerDotStyle: "rounded",
  },
];
