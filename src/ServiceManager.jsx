import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import Navbar from './components/Navbar'
import ModalForm from './ModalForm.jsx'

export default function ServiceManager() {
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()

  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(false)

  // Estado do modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)

  const access = localStorage.getItem('access')

  // Proteção de rota
  useEffect(() => {
    if (!loading && (!user || !user.is_nail_designer)) {
      navigate('/home')
    }
  }, [user, loading])

  // Busca serviços
  const fetchServices = async () => {
    setLoadingServices(true)
    try {
      const res = await fetch('http://localhost:8000/api/services/', {
        headers: access ? { Authorization: `Bearer ${access}` } : {},
      })
      if (!res.ok) throw new Error('Erro ao buscar serviços')
      const data = await res.json()
      setServices(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingServices(false)
    }
  }

  useEffect(() => {
    if (access) fetchServices()
  }, [access])

  // Abrir modal para criar novo serviço
  const handleCreateClick = () => {
    setEditingService(null)
    setModalOpen(true)
  }

  // Abrir modal para editar
  const handleEditClick = (service) => {
    setEditingService(service)
    setModalOpen(true)
  }

  // Desativar serviço (PATCH)
  const handleDeactivate = async (id) => {
    if (!window.confirm('Deseja realmente desativar este serviço?')) return
    try {
      const res = await fetch(`http://localhost:8000/api/services/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ is_active: false }),
      })
      if (!res.ok) throw new Error('Erro ao desativar')
      fetchServices()
      alert('Serviço desativado com sucesso.')
    } catch (err) {
      console.error(err)
      alert('Erro ao desativar serviço.')
    }
  }

  // Após salvar (criar ou editar), fechar modal e atualizar lista
  const onModalSave = () => {
    setModalOpen(false)
    fetchServices()
  }

  if (loading) return <p>Carregando...</p>

  return (
    <>
      <Navbar />
      <div className="pt-20 max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-pink-600 mb-6 text-center">Gerenciar Serviços</h1>

        <button
          onClick={handleCreateClick}
          className="mb-6 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded"
        >
          Novo Serviço
        </button>

        {loadingServices ? (
          <p>Carregando serviços...</p>
        ) : (
          <ul className="space-y-3">
            {services.map((service) => (
              <li key={service.id} className="p-4 bg-gray-100 rounded shadow flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-pink-600">{service.name}</h3>
                  <p className="text-gray-700">{service.description}</p>
                  <p className="text-gray-900 font-semibold">
                    R$ {parseFloat(service.price).toFixed(2)} — {service.duration_minutes} min
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {service.is_active ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditClick(service)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded"
                  >
                    Editar
                  </button>
                  {service.is_active && (
                    <button
                      onClick={() => handleDeactivate(service.id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
                    >
                      Desativar
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {modalOpen && (
          <ModalForm
            service={editingService}
            onClose={() => setModalOpen(false)}
            onSave={onModalSave}
          />
        )}
      </div>
    </>
  )
}
