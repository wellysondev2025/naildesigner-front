// src/Appointments.jsx
import React, { useEffect, useState } from 'react'
import { authFetch } from './api'
import { useNavigate } from 'react-router-dom'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await authFetch('http://localhost:8000/api/appointments/my/')
        if (response.status === 401) {
          // não autorizado - usuário precisa logar
          alert('Por favor, faça login.')
          navigate('/auth') // ajustar para a sua rota de login/cadastro
          return
        }
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAppointments()
  }, [navigate])

  if (loading) return <p>Carregando agendamentos...</p>
  if (appointments.length === 0) return <p>Você não tem agendamentos.</p>

  return (
    <div className="p-10 pt-20">
      <h2 className="text-xl font-bold mb-4">Meus Agendamentos</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.id} className="mb-2 border p-2 rounded">
            <p><strong>Data e hora:</strong> {new Date(appt.scheduled_datetime).toLocaleString()}</p>
            <p><strong>Status:</strong> {appt.status}</p>
            {/* Adicione mais campos conforme o serializer */}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Appointments
