// src/context/AuthContext.tsx
import { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await AuthService.refreshToken();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        AuthService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth(); // Первичная проверка при загрузке

    const intervalId = setInterval(() => {
      checkAuth(); // Проверка каждые 5 минут
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);


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

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
