import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-storage')
        ? JSON.parse(localStorage.getItem('auth-storage') || '{}')?.state?.token
        : null;
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        
        
        
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/auth/login';
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          window.location.href = '/auth/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const handleApiResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data;
};

export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message || 'An unknown error occurred';
    throw new Error(message);
  }
  throw error;
};

export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient(config);
    return handleApiResponse<T>(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
  apiRequest<T>({ ...config, method: 'GET', url });

export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => 
  apiRequest<T>({ ...config, method: 'POST', url, data });

export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => 
  apiRequest<T>({ ...config, method: 'PUT', url, data });

export const patch = <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => 
  apiRequest<T>({ ...config, method: 'PATCH', url, data });

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => 
  apiRequest<T>({ ...config, method: 'DELETE', url });
