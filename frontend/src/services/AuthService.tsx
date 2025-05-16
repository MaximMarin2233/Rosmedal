import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const AuthService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${apiBaseUrl}/api/v1/auth/token`, { email, password });
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }
    return response.data;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    const response = await axios.post(`${apiBaseUrl}/api/v1/auth/token/refresh`, { refresh: refreshToken });
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
    }
    return response.data;
  },

  getAccessToken: () => localStorage.getItem('accessToken'),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

export default AuthService;
