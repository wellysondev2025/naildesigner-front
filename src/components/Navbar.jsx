import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  function handleLogout() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    navigate('/auth')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold text-pink-600 cursor-pointer" onClick={() => navigate('/home')}>
          Pro NailDesigner
        </div>
        <div className="space-x-6">
          <NavLink
            to="/home"
            className={({ isActive }) => 
              isActive ? 'text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-500'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/appointments"
            className={({ isActive }) => 
              isActive ? 'text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-500'
            }
          >
            Agendamentos
          </NavLink>
          <NavLink
            to="/services"
            className={({ isActive }) => 
              isActive ? 'text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-500'
            }
          >
            Serviços
          </NavLink>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-pink-500 font-semibold"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}
