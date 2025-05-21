// Импорт библиотеки axios для выполнения HTTP-запросов
import axios from 'axios';
// Импорт сервиса аутентификации
import AuthService from './AuthService';

// Interceptor для ЗАПРОСОВ

// Добавляем интерцептор, который будет выполняться перед каждым запросом
axios.interceptors.request.use(
  async (config) => {
    // Получаем access токен из AuthService
    const accessToken = AuthService.getAccessToken();

    // Если токен есть — добавляем его в заголовок Authorization
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Возвращаем конфигурацию запроса (возможно изменённую)
    return config;
  },
  // Обработка ошибки конфигурации запроса
  (error) => Promise.reject(error)
);

// Interceptor для ОТВЕТОВ

// Добавляем интерцептор, который будет обрабатывать все ответы
axios.interceptors.response.use(
  // Если ответ успешный — просто возвращаем его
  (response) => response,

  // Обработка ошибок
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 (Unauthorized) и это не повторная попытка
    if (error.response.status === 401 && !originalRequest._retry) {
      // Помечаем запрос как повторный, чтобы избежать бесконечных циклов
      originalRequest._retry = true;

      try {
        // Пробуем обновить токен
        await AuthService.refreshToken();

        // Получаем новый access токен
        const newAccessToken = AuthService.getAccessToken();

        // Если новый токен получен — обновляем заголовки и повторяем запрос
        if (newAccessToken) {
          // Устанавливаем токен по умолчанию для всех новых запросов
          axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

          // Также обновляем токен в текущем (повторяемом) запросе
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        // Повторяем исходный запрос с новым токеном
        return axios(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен — отклоняем ошибку
        return Promise.reject(refreshError);
      }
    }

    // Если это не 401 или уже была попытка — просто отклоняем ошибку
    return Promise.reject(error);
  }
);
