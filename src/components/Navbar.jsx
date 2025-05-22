import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useContext(AuthContext)

  function handleLogout() {
    logout()
    setIsOpen(false) // fecha o menu se estiver aberto
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <div
          className="text-2xl font-bold text-pink-600 cursor-pointer"
          onClick={() => {
            navigate('/home')
            setIsOpen(false)
          }}
        >
          Pro NailDesigner
        </div>

        {/* Nome do usuário (desktop) */}
        {isAuthenticated && (
          <div className="hidden sm:block text-gray-700 text-sm ml-4">
            Bem-vindo(a), <strong>{user?.username}</strong>
          </div>
        )}

        {/* Botão hambúrguer - só aparece em telas pequenas */}
        <button
          className="sm:hidden text-pink-600"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Menu desktop */}
        <div className="hidden sm:flex space-x-6 items-center">
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

          {isAuthenticated && user?.is_nail_designer && (
            <>
              <NavLink
                to="/manage-services"
                className={({ isActive }) =>
                  isActive ? 'text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-500'
                }
              >
                Gerenciar Serviços
              </NavLink>
              <NavLink
                to="/manage-appointments"
                className={({ isActive }) =>
                  isActive ? 'text-pink-600 font-semibold' : 'text-gray-700 hover:text-pink-500'
                }
              >
                Gerenciar Agendamentos
              </NavLink>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-pink-500 font-semibold"
            >
              Sair
            </button>
          ) : (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                isActive
                  ? 'text-pink-600 font-semibold'
                  : 'text-gray-700 hover:text-pink-500 font-semibold'
              }
            >
              Fazer login
            </NavLink>
          )}
        </div>
      </div>

      {/* Menu mobile */}
      {isOpen && (
        <div className="sm:hidden bg-white shadow-md px-4 pb-4 space-y-3">
          {isAuthenticated && (
            <div className="text-gray-700 text-sm">
              Bem-vindo(a), <strong>{user?.username}</strong>
            </div>
          )}

          <NavLink
            to="/home"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-pink-500"
          >
            Home
          </NavLink>
          <NavLink
            to="/appointments"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-pink-500"
          >
            Agendamentos
          </NavLink>
          <NavLink
            to="/services"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-pink-500"
          >
            Serviços
          </NavLink>

          {isAuthenticated && user?.is_nail_designer && (
            <>
              <NavLink
                to="/manage-services"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-pink-500"
              >
                Gerenciar Serviços
              </NavLink>
              <NavLink
                to="/manage-appointments"
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-pink-500"
              >
                Gerenciar Agendamentos
              </NavLink>
            </>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="block text-gray-700 hover:text-pink-500 font-semibold"
            >
              Sair
            </button>
          ) : (
            <NavLink
              to="/auth"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-pink-500 font-semibold"
            >
              Fazer login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  )
}
