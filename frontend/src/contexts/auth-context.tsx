import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { LoadingScreen } from "../components/LoadingScreen";
import { useAuth as useAuthHook } from "../hooks/useAuth";

interface LoginCredentials {
  email: string;
  password: string;
}

interface GoogleCredentials {
  credential: string;
}

// 定義認證狀態的介面
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  googleLogin: (credentials: GoogleCredentials) => Promise<boolean>;
  register: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "auth_state";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored).isAuthenticated : false;
  });

  // 使用 useAuth hook
  const {
    isLoading: apiLoading,
    error: apiError,
    login: apiLogin,
    googleLogin: apiGoogleLogin,
    signup: apiSignup,
  } = useAuthHook();

  useEffect(() => {
    // Check authentication state from storage
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const { isAuthenticated, timestamp } = JSON.parse(stored);
      if (Date.now() - timestamp <= SESSION_DURATION) {
        setIsAuthenticated(isAuthenticated);
      } else {
        // Session expired
        logout();
      }
    }
    setInitializing(false);
  }, []);

  // Persist authentication state
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ isAuthenticated, timestamp: Date.now() })
      );
    }
  }, [isAuthenticated]);

  // Session expiration check
  useEffect(() => {
    const checkSession = () => {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const { timestamp } = JSON.parse(stored);
        if (Date.now() - timestamp > SESSION_DURATION) {
          logout();
        }
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const success = await apiLogin(credentials);
      if (success) {
        setIsAuthenticated(true);
      }
      return success;
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    }
  };

  const googleLogin = async (credentials: GoogleCredentials) => {
    try {
      const success = await apiGoogleLogin(credentials);
      if (success) {
        setIsAuthenticated(true);
      }
      return success;
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    }
  };

  const register = async (credentials: LoginCredentials) => {
    try {
      const success = await apiSignup(credentials);
      if (success) {
        setIsAuthenticated(true);
      }
      return success;
    } catch (err) {
      setIsAuthenticated(false);
      throw err;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem("auth_token"); // 清除 token
  };

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading: apiLoading,
        error: apiError,
        login,
        googleLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
