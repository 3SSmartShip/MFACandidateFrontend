import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('sb-access-token') : null;

    if (token) {
      if (typeof config.headers?.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const requestUrl = error?.config?.url || "";
    const isProfileRequest = requestUrl.includes("/auth/me");

    if (error.response?.status === 401 && !isProfileRequest) {
      console.warn('Unauthorized access. Please login again.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
