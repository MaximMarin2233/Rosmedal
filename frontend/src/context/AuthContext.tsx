import { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/AuthService';

// Тип данных для контекста авторизации
interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Создаём контекст
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер авторизации
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Авторизован ли пользователь
  const [loading, setLoading] = useState<boolean>(true); // Загрузка состояния
  const [error, setError] = useState<string | null>(null); // Ошибка при авторизации

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await AuthService.refreshToken(); // Пытаемся обновить токен
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); // Проверка при загрузке

    const intervalId = setInterval(() => {
      checkAuth(); // Проверка каждые 5 минут
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId); // Очистка таймера
  }, []);

  // Component functions
  // Вход
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.login(email, password);
      setIsAuthenticated(true);
    } catch (err) {
      setError('Ошибка при входе в систему');
      throw new Error(`Ошибка авторизации: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  // Выход
  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    window.location.reload(); // Перезагрузка страницы
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
