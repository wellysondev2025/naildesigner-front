// src/PrivateRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'

export function PrivateRoute({ children }) {
  const token = localStorage.getItem('access')
  if (!token) {
    return <Navigate to="/auth" replace />
  }
  return children
}
