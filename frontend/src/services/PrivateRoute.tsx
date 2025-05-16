import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from './AuthService';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
  [key: string]: any; // Чтобы учитывать любые другие пропсы
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = AuthService.getAccessToken() !== null;

  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" replace state={{ showAlert: true }} />
  );
};

export default PrivateRoute;

