import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('token');
  const location = useLocation();

  if (!isAuth) {
    // Redirect to login, but save the intended destination so we can route them back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
