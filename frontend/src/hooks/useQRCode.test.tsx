import { renderHook, act } from "@testing-library/react";
import { useQRCode } from "./useQRCode";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockQRTemplates } from "../test/mock-data";

describe("useQRCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useQRCode());

    expect(result.current.templates).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should fetch templates successfully", async () => {
    const { result } = renderHook(() => useQRCode());

    await act(async () => {
      await result.current.fetchTemplates();
    });

    expect(result.current.templates).toEqual(mockQRTemplates);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle template fetching error", async () => {
    const { result } = renderHook(() => useQRCode());

    // Mock console.error to prevent error output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock setTimeout to throw error
    const mockError = new Error("Failed to fetch QR templates");
    vi.spyOn(global, "setTimeout").mockImplementationOnce(() => {
      throw mockError;
    });

    await act(async () => {
      try {
        await result.current.fetchTemplates();
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe("Failed to fetch QR templates");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.templates).toEqual([]);

    consoleSpy.mockRestore();
  });

  it("should generate QR code successfully", async () => {
    const { result } = renderHook(() => useQRCode());
    const testUrl = "https://example.com";

    await act(async () => {
      const qrCode = await result.current.generateQRCode(testUrl);

      expect(qrCode).toMatch(/^data:image\/png;base64,/);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it("should generate QR code with template", async () => {
    const { result } = renderHook(() => useQRCode());
    const testUrl = "https://example.com";
    const templateId = "template-1";

    await act(async () => {
      const qrCode = await result.current.generateQRCode(testUrl, templateId);

      expect(qrCode).toMatch(/^data:image\/png;base64,/);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  it("should handle QR code generation error", async () => {
    const { result } = renderHook(() => useQRCode());

    // Mock console.error to prevent error output
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Mock setTimeout to throw error
    const mockError = new Error("Failed to generate QR code");
    vi.spyOn(global, "setTimeout").mockImplementationOnce(() => {
      throw mockError;
    });

    await act(async () => {
      try {
        const qrCode = await result.current.generateQRCode(
          "https://example.com"
        );
        expect(qrCode).toBeNull();
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.error).toBe("Failed to generate QR code");
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });
});
