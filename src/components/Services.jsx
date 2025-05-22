import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

export default function Services() {
  const [services, setServices] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:8000/api/services/')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error('Erro ao buscar serviços:', err))
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <>
      <Navbar />

      <div className="pt-20 max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-10">
          Nossos Serviços
        </h1>

        {services.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum serviço disponível.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id || index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <img
                  src={`https://source.unsplash.com/400x300/?nail,${index}`}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-pink-600 mb-1">
                    {service.name}
                  </h2>
                  <p className="text-gray-700 text-sm mb-2 flex-grow">{service.description}</p>
                  <p className="text-gray-900 font-semibold mb-3">
                    R$ {parseFloat(service.price).toFixed(2)} — {service.duration_minutes} min
                  </p>
                  <button
                    onClick={() => navigate(`/services/${service.id}/schedule`, { state: { service } })}
                    className="mt-auto bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
                  >
                    Agendar
                  </button>

                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
