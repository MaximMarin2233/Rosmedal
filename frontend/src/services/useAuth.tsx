// Импорт хуков React и сервиса аутентификации
import { useState, useEffect } from 'react';
import AuthService from './AuthService';

// Кастомный хук useAuth — управляет логикой авторизации пользователя
const useAuth = () => {
  // Состояние загрузки (true, пока идёт проверка или авторизация)
  const [loading, setLoading] = useState(true);

  // Состояние ошибки (используется при ошибке входа)
  const [error, setError] = useState<string | null>(null);

  // Состояние авторизации пользователя (true/false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Проверка токена при первом рендере компонента
  useEffect(() => {
    const accessToken = AuthService.getAccessToken();
    setIsAuthenticated(!!accessToken); // Преобразуем токен в boolean (true, если токен есть)
    setLoading(false); // Проверка завершена
  }, []);

  /**
   * Функция входа (логина)
   * @param email — Email пользователя
   * @param password — Пароль пользователя
   */
  const login = async (email: string, password: string) => {
    setLoading(true); // Включаем загрузку
    setError(null);   // Сброс ошибок

    try {
      // Пытаемся войти через AuthService
      await AuthService.login(email, password);

      // Успешный вход — обновляем состояние
      setIsAuthenticated(true);
      alert('Вы успешно вошли в систему!');
    } catch (err) {
      // Ошибка при логине
      console.error('Ошибка при входе в систему', err);
      setError('Ошибка при входе в систему');
    } finally {
      // В любом случае — выключаем загрузку
      setLoading(false);
    }
  };

  /**
   * Функция выхода (логаута)
   */
  const logout = () => {
    AuthService.logout();       // Удаляем токены
    setIsAuthenticated(false);  // Обновляем состояние
  };

  // Возвращаем объект с состояниями и функциями для использования в компонентах
  return { login, logout, loading, error, isAuthenticated };
};

export default useAuth;
