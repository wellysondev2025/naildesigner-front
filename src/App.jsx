import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthForm from './auth/AuthForm'
import Home from './home/Home'
import Appointments from './features/Appointments/Appointments'
import { PrivateRoute } from "./components/PrivateRoute";
import Services from './features/services/Services'
import Navbar from './components/Navbar'  // ou o caminho correto para o seu arquivo Navbar.jsx
import ScheduleService from './features/services/ScheduleService'
import ServiceManager from './features/services/ServiceManager' // ou './pages/ServiceManager' se organizar depois
import ManageAppointments from './features/appointments/ManageAppointments'
import Footer from './components/Footer'  // ou o caminho correto para o seu arquivo Navbar.jsx




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
    <Footer />
    </>
  )
}

export default App
