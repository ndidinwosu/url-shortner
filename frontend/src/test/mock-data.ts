export const mockUser = {
  id: "1",
  email: "testuser@example.com",
  name: "Test User",
  createdAt: "2024-01-01T00:00:00.000Z",
  isPremium: false,
};

export const mockPreferences = {
  theme: "light",
  customDomain: null,
  defaultExpiryDays: 30,
  emailNotifications: true,
};

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
