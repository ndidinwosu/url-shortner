import { useState } from "react";
import { apiClient } from "../lib/api-client";

interface LoginCredentials {
  email: string;
  password: string;
}

interface GoogleCredentials {
  credential: string;
}

const TEST_USER = {
  email: "testuser@example.com",
  password: "test1234",
};

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.email);
      formData.append("password", credentials.password);

      const response = await apiClient.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, token_type } = response.data;
      localStorage.setItem("auth_token", access_token);
      return true;
    } catch (err) {
      setError("Login failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // const googleLogin = async (credentials: GoogleCredentials) => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     // Simulate API delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));
  //     console.log("Google login successful:", credentials);
  //     return true;
  //   } catch (err) {
  //     setError("Google login failed");
  //     throw err;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const googleLogin = async (credentials: GoogleCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      // 使用 JSON 格式發送數據
      const response = await apiClient.post("/auth/google-login", {
        token: credentials.credential
      });
      
      const { access_token } = response.data;
      localStorage.setItem("auth_token", access_token);
      console.log("Google login successful:", credentials);
      return true;
    } catch (err) {
      setError("Google login failed");
      console.error("Google login error:", err);  // 加入詳細的錯誤記錄
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/register", {
        email: credentials.email,
        password: credentials.password,
      });
      return true;
    } catch (err) {
      setError("Signup failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    login,
    googleLogin,
    signup,
  };
}
