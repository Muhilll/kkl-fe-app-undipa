/**
 * API Service
 * Centralized API calls and configurations
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get auth headers with token and app token
 */
function getAuthHeaders(
  includeAppToken: boolean = true,
  isFormData: boolean = false,
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Get JWT token from localStorage
  const token = localStorage.getItem("authToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Add app token from environment variable (optional, for protected endpoints)
  if (includeAppToken) {
    const appToken = import.meta.env.VITE_APP_TOKEN;
    if (appToken) {
      headers["X-App-Token"] = appToken;
    }
  }

  return headers;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<ApiResponse<T>> {
  try {
    // Only include app token for requests with JWT token (authenticated/protected endpoints)
    const token = localStorage.getItem("authToken");
    const includeAppToken = !!token;

    const isFormData =
      typeof FormData !== "undefined" && options?.body instanceof FormData;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...getAuthHeaders(includeAppToken, isFormData),
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const json = await response.json();
    // Extract the actual data from response, handle both wrapped and direct responses
    const data = json.data !== undefined ? json.data : json;
    return { success: json.success, data, message: json.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const api = {
  get: <T>(endpoint: string) => apiCall<T>(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, body: unknown) =>
    apiCall<T>(endpoint, {
      method: "POST",
      body:
        typeof FormData !== "undefined" && body instanceof FormData
          ? body
          : JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown) =>
    apiCall<T>(endpoint, {
      method: "PUT",
      body:
        typeof FormData !== "undefined" && body instanceof FormData
          ? body
          : JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => apiCall<T>(endpoint, { method: "DELETE" }),
};
