import { useNavigate } from 'react-router-dom'
import React from 'react'
import Navbar from "./components/Navbar"
import { motion } from 'framer-motion'

const cardsData = [
  {
    img: 'https://images.unsplash.com/photo-1542838687-c8b6bca4f11d?auto=format&fit=crop&w=400&q=80',
    title: 'Unha Francesinha',
    description: 'Clássica e elegante para qualquer ocasião.',
  },
  {
    img: 'https://images.unsplash.com/photo-1504609813445-0f3ec4b74e8f?auto=format&fit=crop&w=400&q=80',
    title: 'Unha com Glitter',
    description: 'Brilho que destaca sua beleza.',
  },
  {
    img: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
    title: 'Unha Decorada',
    description: 'Arte personalizada nas pontas dos dedos.',
  },
  {
    img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80',
    title: 'Unha Vermelha',
    description: 'O clássico que nunca sai de moda.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function Home() {
  return (
    <>
      {/* Navbar fixa */}
      <Navbar />

      {/* Espaço para compensar navbar fixa */}
      <div className="pt-20 max-w-7xl mx-auto px-4">
        {/* Banner */}
        <div
          className="w-full h-64 rounded-lg bg-cover bg-center mb-10 shadow-md"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80)' }}
          aria-label="Banner de apresentação"
        >
          <div className="bg-black bg-opacity-40 w-full h-full flex items-center justify-center rounded-lg">
            <h1 className="text-white text-4xl font-bold drop-shadow-lg">Bem-vinda à Pro NailDesigner</h1>
          </div>
        </div>

        {/* Cards animados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cardsData.map(({ img, title, description }, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <img src={img} alt={title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-pink-600 mb-2">{title}</h2>
                <p className="text-gray-700 text-sm">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
