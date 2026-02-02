import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_WGER_API_URL || 'https://wger.de/api/v2',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      toast.warning('You are offline', {
        description: 'Using cached data when available',
      });
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig | undefined;

    // Retry em caso de timeout
    if (
      originalRequest &&
      originalRequest.headers &&
      !originalRequest.headers['X-Retry-Count'] &&
      (error.code === 'ECONNABORTED' || error.message === 'Network Error')
    ) {
      originalRequest.headers['X-Retry-Count'] = '1';
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;