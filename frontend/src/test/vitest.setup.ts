import { expect, afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { vi } from "vitest";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers as any);

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
};

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Restore console methods
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});

beforeEach(() => {
  // Mock console methods by default to reduce noise
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock clipboard API
Object.defineProperty(navigator, "clipboard", {
  writable: true,
  value: {
    writeText: vi.fn(),
  },
});
