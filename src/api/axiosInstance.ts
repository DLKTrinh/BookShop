import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, clearAccessToken } from "./tokenStore";
import  type { ApiError } from "./apiError";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error("❌ Missing VITE_API_BASE_URL in your .env.local file");
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // required to send/receive the httpOnly refreshToken cookie
});

// A separate, interceptor-free instance for the refresh call itself, so a failed
// refresh can never re-trigger the 401 handler below and loop forever.
const refreshClient = axios.create({ baseURL, withCredentials: true });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function performRefresh(): Promise<string> {
  // De-dupe concurrent 401s (e.g. several book requests firing at once) into a
  // single /refresh call instead of one per failed request.
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post("/api/auth/refresh")
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        return data.accessToken as string;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/register") ||
      originalRequest?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      try {
        const newToken = await performRefresh();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAccessToken();
        return Promise.reject(normalizeError(refreshError as AxiosError<any>));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

function normalizeError(error: AxiosError<any>): ApiError {
  const message = error.response?.data?.message ?? error.message ?? "Something went wrong";
  const normalized = new Error(message) as ApiError;
  normalized.name = "ApiError";
  normalized.status = error.response?.status;
  normalized.fieldErrors = error.response?.data?.errors;
  return normalized;
}

export default api;