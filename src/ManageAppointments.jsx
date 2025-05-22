import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ManageAppointments() {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth')
      return
    }

    if (!user?.is_nail_designer) {
      navigate('/')
      return
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/appointments/', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Erro ao buscar agendamentos.')
        }

        const data = await response.json()

        // DEBUG: log para inspecionar os dados recebidos
        console.log('Appointments fetched:', data)

        setAppointments(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user, isAuthenticated, navigate])

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Carregando agendamentos...</p>
  if (error)
    return <p className="text-center mt-10 text-red-500">Erro: {error}</p>

  return (
    <div className="max-w-5xl mx-auto mt-20 px-4">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">Gerenciar Agendamentos</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600">Nenhum agendamento encontrado.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            // DEBUG: log para inspecionar o preço do serviço
            console.log('Service price:', appt.service_detail?.price)

            // Valor seguro para price, converte para número e usa toFixed(2)
            const price =
              appt.service_detail?.price != null && !isNaN(Number(appt.service_detail.price))
                ? Number(appt.service_detail.price).toFixed(2)
                : '0.00'

            return (
              <div
                key={appt.id}
                className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-pink-500">
                    {appt.service_detail?.name || 'Serviço'}
                  </h3>
                  <span
                    className={`text-sm px-2 py-1 rounded-full capitalize ${
                      appt.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : appt.status === 'awaiting_payment'
                        ? 'bg-blue-100 text-blue-700'
                        : appt.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : appt.status === 'completed'
                        ? 'bg-gray-200 text-gray-800'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {appt.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  Cliente: <strong>{appt.client?.username || 'Desconhecido'}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Telefone: <strong>{appt.client?.phone || '---'}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Data/Hora: {new Date(appt.scheduled_datetime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Observações: {appt.notes || 'Nenhuma'}
                </p>
                <p className="text-sm text-gray-600">
                  Valor: <strong>R$ {price}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Duração: {appt.service_detail?.duration_minutes ?? '--'} min
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
