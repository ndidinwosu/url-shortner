import { ThemeProvider } from "./contexts/theme-context";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { Dashboard } from "./components/Dashboard";
import { Navbar } from "./components/navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "./components/Login";
import { LandingPage } from "./components/pages/LandingPage";
import { SignupPage } from "./components/pages/SignupPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useTheme } from "./contexts/theme-context";
import { useEffect } from "react";

// Replace with your actual Google Client ID
const GOOGLE_CLIENT_ID = "119612271394-b9f06c45bt8pa7eo5a7p660mnjl5ltdo.apps.googleusercontent.com";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Apply theme class to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
