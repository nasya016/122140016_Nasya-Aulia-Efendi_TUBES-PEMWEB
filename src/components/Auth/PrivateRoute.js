import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const loggedInUser = localStorage.getItem('loggedInUser');

  if (!loggedInUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}