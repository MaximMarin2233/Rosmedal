import axios from 'axios';
import AuthService from './AuthService';

axios.interceptors.request.use(
  async (config) => {
    const accessToken = AuthService.getAccessToken();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await AuthService.refreshToken();
      const newAccessToken = AuthService.getAccessToken();
      if (newAccessToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      }
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);
