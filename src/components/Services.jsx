import React, { useEffect, useState } from 'react'

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8000/api/services/')  // Ajusta para sua URL real
      .then(res => res.json())
      .then(data => {
        setServices(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p>Carregando serviços...</p>
  if (!services.length) return <p>Nenhum serviço disponível.</p>

  return (
    <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {services.map(service => (
        <div key={service.id} className="border rounded p-4 shadow">
          <img src={service.image_url} alt={service.title} className="w-full h-48 object-cover rounded" />
          <h3 className="text-xl font-semibold mt-2">{service.title}</h3>
          <p className="mt-1 text-gray-600">{service.description}</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={() => {
              // Aqui você vai tratar a lógica para agendar
            }}
          >
            Agendar
          </button>
        </div>
      ))}
    </div>
  )
}
