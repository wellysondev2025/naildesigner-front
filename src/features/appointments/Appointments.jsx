import React, { useEffect, useState } from 'react'
import { authFetch } from '../../api/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Appointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalData, setModalData] = useState(null) // dados do agendamento no modal
  const [cancelLoadingId, setCancelLoadingId] = useState(null) // id agendamento cancelando
  const navigate = useNavigate()

  const statusIcons = {
    pending: '⏳',
    confirmed: '✅',
    cancelled: '❌',
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await authFetch('http://localhost:8000/api/appointments/my/')
        if (response.status === 401) {
          toast.error('Por favor, faça login.')
          navigate('/auth')
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

  const openModal = (appt) => setModalData(appt)
  const closeModal = () => setModalData(null)

  // Função para cancelar agendamento
  const cancelAppointment = async (id) => {
    if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return
    setCancelLoadingId(id)
    try {
      const response = await authFetch(`http://localhost:8000/api/appointments/${id}/cancel/`, {
        method: 'POST',
      })
      if (response.ok) {
        toast.success('Agendamento cancelado com sucesso.')
        // Atualiza lista localmente para refletir cancelamento
        setAppointments((prev) =>
          prev.map((appt) =>
            appt.id === id ? { ...appt, status: 'cancelled' } : appt
          )
        )
        if (modalData?.id === id) closeModal()
      } else {
        const errorData = await response.json()
        toast.error(`Erro ao cancelar: ${errorData.detail || 'Tente novamente'}`)
      }
    } catch (error) {
      toast.error('Erro inesperado ao cancelar.')
      console.error(error)
    } finally {
      setCancelLoadingId(null)
    }
  }

  if (loading) return <p className="p-10 pt-20 text-center">Carregando agendamentos...</p>
  if (appointments.length === 0) return <p className="p-10 pt-20 text-center">Você não tem agendamentos.</p>

  return (
    <div className="p-10 pt-20 max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">Meus Agendamentos</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 px-4">
        {appointments.map((appt) => {
          const canCancel = ['pending', 'confirmed'].includes(appt.status)
          return (
            <li
              key={appt.id}
              className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              {/* Imagem no topo */}
              {appt.service_detail?.image ? (
                <img
                  src={appt.service_detail.image}
                  alt={appt.service_detail.name}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400">
                  Sem imagem
                </div>
              )}

              {/* Conteúdo */}
              <div className="p-3 flex flex-col flex-grow">
                <h3
                  className="text-lg font-semibold text-pink-600 mb-1 truncate"
                  title={appt.service_detail?.name}
                >
                  {appt.service_detail?.name || 'Serviço'}
                </h3>
                <p
                  className="text-gray-700 text-sm mb-1 truncate"
                  title={new Date(appt.scheduled_datetime).toLocaleString('pt-BR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                >
                  <strong>Data e hora:</strong>{' '}
                  {new Date(appt.scheduled_datetime).toLocaleString('pt-BR', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                      statusColors[appt.status] || 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {statusIcons[appt.status] || 'ℹ️'}{' '}
                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                  </span>
                </p>
                {appt.notes && (
                  <p
                    className="mt-auto text-gray-600 italic text-xs truncate"
                    title={appt.notes}
                  >
                    <strong>Notas:</strong> {appt.notes}
                  </p>
                )}
                {appt.is_partial_paid && (
                  <p className="mt-2 text-xs font-semibold text-blue-600">
                    Pagamento parcial realizado
                  </p>
                )}

                {/* Botões */}
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openModal(appt)}
                    className="flex-grow bg-pink-600 hover:bg-pink-700 text-white py-1 rounded text-sm"
                  >
                    Detalhes
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => cancelAppointment(appt.id)}
                      disabled={cancelLoadingId === appt.id}
                      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelLoadingId === appt.id ? 'Cancelando...' : 'Cancelar'}
                    </button>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Modal simples */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Fechar modal"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-pink-600">
              Detalhes do Agendamento
            </h3>
            <p><strong>Serviço:</strong> {modalData.service_detail?.name}</p>
            <p>
              <strong>Data e hora:</strong>{' '}
              {new Date(modalData.scheduled_datetime).toLocaleString('pt-BR', {
                dateStyle: 'full',
                timeStyle: 'short',
              })}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                  statusColors[modalData.status] || 'bg-gray-200 text-gray-800'
                }`}
              >
                {statusIcons[modalData.status] || 'ℹ️'}{' '}
                {modalData.status.charAt(0).toUpperCase() + modalData.status.slice(1)}
              </span>
            </p>
            {modalData.notes && <p><strong>Notas:</strong> {modalData.notes}</p>}
            {modalData.is_partial_paid && (
              <p className="text-blue-600 font-semibold mt-2">
                Pagamento parcial realizado
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointments
