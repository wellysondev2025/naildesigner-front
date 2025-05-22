import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthForm from './AuthForm'
import Home from './Home'
import Appointments from './Appointments'
import { PrivateRoute } from "./PrivateRoute";
import Services from './components/Services'
import Navbar from './components/Navbar'  // ou o caminho correto para o seu arquivo Navbar.jsx
import ScheduleService from './ScheduleService'
import ServiceManager from './ServiceManager' // ou './pages/ServiceManager' se organizar depois
import ManageAppointments from './ManageAppointments'



function App() {
  return (
    <>
    <Navbar />
    <div className="pt-10"></div>
    <Routes>
      {/* Home pública */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />

      {/* Login/Cadastro */}
      <Route path="/auth" element={<AuthForm />} />

      {/* Serviços visíveis a todos */}
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id/schedule" element={<PrivateRoute><ScheduleService /></PrivateRoute>} />

      {/* Services Manager */}
      <Route path="/manage-services" element={<PrivateRoute><ServiceManager /></PrivateRoute>} />
      {/* Manage Appointments */}
      <Route path="/manage-appointments" element={<ManageAppointments />} />


      {/* Agendamentos protegidos */}
      <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
    </Routes>
    </>
  )
}

export default App
