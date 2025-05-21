// Импорт React и необходимых компонентов из react-router-dom
import React from 'react';
import { Navigate } from 'react-router-dom';
// Импорт AuthService для проверки токена
import AuthService from './AuthService';

// Интерфейс пропсов для компонента PrivateRoute
interface PrivateRouteProps {
  component: React.ComponentType<any>; // Компонент, который нужно отрендерить при наличии доступа
  [key: string]: any; // Остальные пропсы, которые могут быть переданы в компонент
}

// Компонент PrivateRoute защищает маршруты от неавторизованного доступа
const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  // Проверка: есть ли access токен, чтобы определить, авторизован ли пользователь
  const isAuthenticated = AuthService.getAccessToken() !== null;

  // Если пользователь авторизован — рендерим указанный компонент с переданными пропсами
  // Иначе — перенаправляем на главную страницу с параметром состояния
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace state={{ showAlert: true }} />
  );
};

export default PrivateRoute;
