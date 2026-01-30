import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the backend URL dynamically based on the current origin
 * Works for both localhost and domain environments
 */
export function getBackendURL(): string {
  // In development mode, use proxy
  if (import.meta.env.MODE === "development") {
    return "/api";
  }

  // In production, check if we're on localhost or domain
  const currentOrigin = typeof window !== "undefined" ? window.location.origin : "";
  const isLocalhost = currentOrigin.includes("localhost") || currentOrigin.includes("127.0.0.1");

  if (isLocalhost) {
    // If running on localhost, use localhost backend
    return import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  } else {
    // If running on domain, use domain backend or env variable
    // Try to construct backend URL from current origin
    if (import.meta.env.VITE_BACKEND_URL) {
      return import.meta.env.VITE_BACKEND_URL;
    }
    // Fallback: assume backend is on same domain but different port
    return currentOrigin.replace(/:\d+$/, "") + ":5000";
  }
}
