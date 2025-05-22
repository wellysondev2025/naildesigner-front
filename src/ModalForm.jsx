import React, { useEffect, useState } from 'react'

export default function ModalForm({ service, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
  })
  const [loading, setLoading] = useState(false)

  const access = localStorage.getItem('access')

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        duration_minutes: service.duration_minutes || '',
      })
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        duration_minutes: '',
      })
    }
  }, [service])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = service
        ? `http://localhost:8000/api/services/${service.id}/`
        : 'http://localhost:8000/api/services/'

      const method = service ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro ao salvar serviço:', errorData)
        alert('Erro ao salvar serviço.')
      } else {
        alert(service ? 'Serviço atualizado!' : 'Serviço criado!')
        onSave()
      }
    } catch (err) {
      console.error('Erro inesperado:', err)
      alert('Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
        >
          <h2 className="text-xl font-bold mb-4 text-pink-600">
            {service ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Nome do serviço"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />

          <textarea
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />

          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Preço"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          />

          <input
            type="number"
            name="duration_minutes"
            placeholder="Duração (minutos)"
            value={form.duration_minutes}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
