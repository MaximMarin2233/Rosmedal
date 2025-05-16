import { useState, useEffect } from 'react';
import AuthService from './AuthService';

const useAuth = () => {
  const [loading, setLoading] = useState(true); // Начальное состояние загрузки true
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const accessToken = AuthService.getAccessToken();
    setIsAuthenticated(!!accessToken);
    setLoading(false); // Устанавливаем состояние загрузки в false после проверки токена
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.login(email, password);
      setIsAuthenticated(true);
      alert('Вы успешно вошли в систему!');
    } catch (err) {
      console.error('Ошибка при входе в систему', err);
      setError('Ошибка при входе в систему');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return { login, logout, loading, error, isAuthenticated };
};

export default useAuth;
