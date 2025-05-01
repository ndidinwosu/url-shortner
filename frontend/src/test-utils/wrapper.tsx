import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "../contexts/theme-context";

/**
 * A wrapper component that provides all necessary context providers for testing
 * This includes:
 * - ThemeProvider - for theme context
 * - BrowserRouter - for routing
 */
export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>{children}</ThemeProvider>
    </BrowserRouter>
  );
}

/**
 * A custom render function that wraps components with the TestWrapper
 * Use this for components that need access to theme context and routing
 */
export function renderWithProviders(ui: React.ReactElement) {
  return <TestWrapper>{ui}</TestWrapper>;
}
