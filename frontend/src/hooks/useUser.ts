import { useState } from "react";
import { mockUser, mockPreferences } from "../mock-data";

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  isPremium: boolean;
}

interface UserPreferences {
  theme: string;
  defaultExpiryDays: number;
  emailNotifications: boolean;
  customDomain: string | null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUser(mockUser);
      setPreferences(mockPreferences);
    } catch (err) {
      setError("Failed to fetch user data");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreferences = async (
    newPreferences: Partial<UserPreferences>
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPreferences((prev) => ({ ...prev!, ...newPreferences }));
      return true;
    } catch (err) {
      setError("Failed to update preferences");
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    preferences,
    isLoading,
    error,
    fetchUser,
    updatePreferences,
  };
}
