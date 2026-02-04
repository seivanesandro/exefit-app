import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WGER_API_URL || "https://wger.de/api/v2",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Request
axiosInstance.interceptors.request.use(
  (config) => {
    // Toast não funciona no servidor (SSR/RSC), apenas no cliente
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && !navigator.onLine) {
      console.warn("[axios] You are offline - using cached data when available");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de Response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | InternalAxiosRequestConfig
      | undefined;

    // Retry em caso de timeout
    if (
      originalRequest &&
      originalRequest.headers &&
      !originalRequest.headers["X-Retry-Count"] &&
      (error.code === "ECONNABORTED" || error.message === "Network Error")
    ) {
      originalRequest.headers["X-Retry-Count"] = "1";
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
