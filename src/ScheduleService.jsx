import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'

export default function ScheduleService() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:8000/api/services/${id}/`)
      .then((res) => res.json())
      .then((data) => setService(data))
      .catch((err) => console.error('Erro ao buscar serviço:', err))
  }, [id])

  const handleSchedule = async (e) => {
    e.preventDefault()
    const access = localStorage.getItem('access')
    if (!access) {
      alert('Você precisa estar logado para agendar.')
      navigate('/auth')
      return
    }

    if (!date || !time) {
      alert('Por favor, selecione data e horário.')
      return
    }

    // Monta o scheduled_datetime no formato ISO 8601 esperado
    const scheduled_datetime = `${date}T${time}:00`

    try {
      const response = await fetch('http://localhost:8000/api/appointments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          service: id,
          scheduled_datetime,
        }),
      })

      if (response.ok) {
        alert('Agendamento realizado com sucesso!')
        navigate('/appointments')
      } else {
        const errorData = await response.json()
        console.error('Erro no agendamento:', errorData)
        alert('Erro ao agendar. Verifique os dados e tente novamente.')
      }
    } catch (err) {
      console.error('Erro:', err)
      alert('Erro inesperado.')
    }
  }

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-xl mx-auto px-4">
        {!service ? (
          <p className="text-center">Carregando serviço...</p>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-pink-600 mb-4">{service.name}</h1>
            <p className="text-gray-700 mb-2">{service.description}</p>
            <p className="text-gray-900 font-semibold mb-6">
              R$ {parseFloat(service.price).toFixed(2)} — {service.duration_minutes} min
            </p>

            <form onSubmit={handleSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Horário</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
              >
                Confirmar Agendamento
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
