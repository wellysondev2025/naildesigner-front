import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthForm from './AuthForm'
import Home from './Home'
import Appointments from './Appointments'
import { PrivateRoute } from './PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
      {/* Rota raiz redireciona para /home ou /auth conforme token */}
      <Route path="/" element={
        localStorage.getItem('access') ? <Navigate to="/home" /> : <Navigate to="/auth" />
      } />
    </Routes>
  )
}

export default App
