import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../utils/storage';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If roles are defined, check if user has permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div style={{ padding: '20px', color: 'red' }}>Access Denied: You do not have permission.</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;