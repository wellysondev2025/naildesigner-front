import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from 'react-datepicker'

export default function ScheduleService() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState('')
  const [occupiedTimes, setOccupiedTimes] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:8000/api/services/${id}/`)
      .then((res) => res.json())
      .then((data) => setService(data))
      .catch((err) => console.error('Erro ao buscar serviço:', err))
  }, [id])

  useEffect(() => {
    if (!date || !service) return

    const dateStr = date.toISOString().slice(0, 10)
    const access = localStorage.getItem('access')

    fetch(`http://localhost:8000/api/appointments/occupied_times/?service=${id}&date=${dateStr}`, {
      headers: {
        Authorization: `Bearer ${access}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOccupiedTimes(data)
          setTime('')
        } else {
          console.error('Resposta inválida:', data)
          setOccupiedTimes([])
        }
      })
      .catch(err => {
        console.error('Erro ao buscar horários ocupados:', err)
        setOccupiedTimes([])
      })
  }, [date, service, id])

  const handleSchedule = async (e) => {
    e.preventDefault()
    const access = localStorage.getItem('access')

    if (!access) {
      toast.error('Você precisa estar logado para agendar.')
      navigate('/auth')
      return
    }

    if (!date || !time) {
      toast.error('Por favor, selecione data e horário.')
      return
    }

    const [hours, minutes] = time.split(':')
    const selectedDate = new Date(date)
    selectedDate.setHours(parseInt(hours, 10))
    selectedDate.setMinutes(parseInt(minutes, 10))
    selectedDate.setSeconds(0)
    selectedDate.setMilliseconds(0)

    const scheduled_datetime = selectedDate.toISOString()

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
        toast.success('Agendamento realizado com sucesso!')
        setTimeout(() => {
          navigate('/appointments')
        }, 2000)
      } else {
        const errorData = await response.json()
        console.error('Erro no agendamento:', errorData)
        toast.error('Erro ao agendar. Verifique os dados e tente novamente.')
      }
    } catch (err) {
      console.error('Erro:', err)
      toast.error('Erro inesperado.')
    }
  }

  function isTimeOccupied(hour) {
    return occupiedTimes.some(slot => {
      const slotStart = new Date(slot.start)
      return slotStart.getHours() === hour && slotStart.getMinutes() === 0
    })
  }

  const hoursOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i * 2
    const hourString = hour.toString().padStart(2, '0')
    if (isTimeOccupied(hour)) return null
    return (
      <option key={hour} value={`${hourString}:00`}>
        {hourString}:00
      </option>
    )
  }).filter(Boolean)

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start md:items-stretch max-w-5xl mx-auto px-4 pt-20">
      {/* LADO ESQUERDO — imagem e detalhes */}
      <div className="md:w-1/2 flex flex-col">
        <h1 className="text-2xl font-bold text-pink-600 mb-4">{service ? service.name : 'Carregando...'}</h1>
        {service && service.image ? (
          <img
            src={service.image.startsWith('http') ? service.image : `http://localhost:8000${service.image}`}
            alt={service.name}
            className="w-full h-64 object-cover rounded mb-4"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded mb-4 text-gray-500">
            Sem imagem
          </div>
        )}
        <p className="text-gray-700 mb-2 flex-grow">{service?.description}</p>
        <p className="text-gray-900 font-semibold">
          R$ {service ? parseFloat(service.price).toFixed(2) : '0.00'} — {service ? service.duration_minutes : 0} min
        </p>
      </div>

      {/* LADO DIREITO — formulário */}
      <div className="md:w-1/2 flex flex-col justify-center">
        <form onSubmit={handleSchedule} className="space-y-4 w-full max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <DatePicker
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              placeholderText="Selecione uma data"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Horário</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={!date || hoursOptions.length === 0}
            >
              <option value="">Selecione o horário</option>
              {hoursOptions.length > 0 ? (
                hoursOptions
              ) : (
                <option disabled>Nenhum horário disponível nesta data</option>
              )}
            </select>
          </div>
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
            disabled={!date || hoursOptions.length === 0}
          >
            Confirmar Agendamento
          </button>
        </form>
      </div>
    </div>
  )
}
  