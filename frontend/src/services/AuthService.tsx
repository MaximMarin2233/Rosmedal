// Импорт библиотеки axios для работы с HTTP-запросами
import axios from 'axios';

// Получение базового URL API из переменных окружения
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

// Сервис для работы с аутентификацией
const AuthService = {
  /**
   * Отправка запроса на вход (логин) пользователя.
   * @param email - Email пользователя
   * @param password - Пароль пользователя
   * @returns Объект с access и refresh токенами
   */
  login: async (email: string, password: string) => {
    // POST-запрос на получение токенов
    const response = await axios.post(`${apiBaseUrl}/api/v1/auth/token`, { email, password });

    // Если получены токены, сохраняем их в localStorage
    if (response.data.access && response.data.refresh) {
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
    }

    // Возвращаем полученные данные (обычно содержит access и refresh токены)
    return response.data;
  },

  /**
   * Обновление access токена с использованием refresh токена.
   * @returns Новый access токен
   */
  refreshToken: async () => {
    // Получаем refresh токен из localStorage
    const refreshToken = localStorage.getItem('refreshToken');

    // Если refresh токена нет — выбрасываем ошибку
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    // POST-запрос на обновление access токена
    const response = await axios.post(`${apiBaseUrl}/api/v1/auth/token/refresh`, { refresh: refreshToken });

    // Если новый access токен получен — сохраняем его
    if (response.data.access) {
      localStorage.setItem('accessToken', response.data.access);
    }

    // Возвращаем данные с новым токеном
    return response.data;
  },

  /**
   * Получение текущего access токена из localStorage.
   * @returns Текущий access токен или null, если его нет
   */
  getAccessToken: () => localStorage.getItem('accessToken'),

  /**
   * Удаление access и refresh токенов при выходе пользователя.
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

// Экспорт сервиса для использования в других частях приложения
export default AuthService;
