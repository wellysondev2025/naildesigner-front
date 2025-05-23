import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function ModalForm({ service, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const access = localStorage.getItem('access')

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name || '',
        description: service.description || '',
        price: service.price !== undefined ? service.price.toString() : '',
        duration_minutes: service.duration_minutes !== undefined ? service.duration_minutes.toString() : '',
      })
      setImageFile(null)
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        duration_minutes: '',
      })
      setImageFile(null)
    }
  }, [service])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = new FormData()
    payload.append('name', form.name.trim())
    payload.append('description', form.description.trim())
    payload.append('price', parseFloat(form.price))
    payload.append('duration_minutes', parseInt(form.duration_minutes, 10))
    if (imageFile) {
      payload.append('image', imageFile)
    }

    // Validação simples
    if (!form.name.trim()) {
      toast.error('O nome do serviço é obrigatório.')
      setLoading(false)
      return
    }
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      toast.error('Informe um preço válido maior que zero.')
      setLoading(false)
      return
    }
    if (isNaN(parseInt(form.duration_minutes, 10)) || parseInt(form.duration_minutes, 10) <= 0) {
      toast.error('Informe uma duração válida maior que zero.')
      setLoading(false)
      return
    }

    try {
      const url = service
        ? `http://localhost:8000/api/services/${service.id}/`
        : 'http://localhost:8000/api/services/'

      const method = service ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${access}`,
        },
        body: payload,
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro ao salvar serviço:', errorData)
        toast.error('Erro ao salvar serviço. Verifique os dados e tente novamente.')
      } else {
        toast.success(service ? 'Serviço atualizado com sucesso!' : 'Serviço criado com sucesso!')
        onSave()
        setForm({ name: '', description: '', price: '', duration_minutes: '' })
        setImageFile(null)
      }
    } catch (err) {
      console.error('Erro inesperado:', err)
      toast.error('Erro inesperado. Tente novamente mais tarde.')
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
            disabled={loading}
          />

          <textarea
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            disabled={loading}
          />

          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Preço"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            disabled={loading}
          />

          <input
            type="number"
            name="duration_minutes"
            placeholder="Duração (minutos)"
            value={form.duration_minutes}
            onChange={handleChange}
            required
            min="0"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            disabled={loading}
          />

          <div className="mb-4">
            <label
              htmlFor="imageUpload"
              className="cursor-pointer inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              Escolher imagem
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
            />
            {imageFile && (
              <p className="text-sm text-gray-700 mt-2">Imagem selecionada: {imageFile.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                setForm({ name: '', description: '', price: '', duration_minutes: '' })
                setImageFile(null)
              }}
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
