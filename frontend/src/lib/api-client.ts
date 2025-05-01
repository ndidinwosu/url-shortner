import axios from "axios";

// Get the base URL from environment variables or use a default
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/v1";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/") {
      // 只有在非首頁的情況下才重導向到登入頁
      console.log("Unauthorized, (should) redirecting to login...");
      // localStorage.removeItem("auth_token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
