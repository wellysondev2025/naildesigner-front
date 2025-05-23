import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// URL base da sua API
const API_BASE_URL = 'http://localhost:8000/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null) // objeto completo do usuário
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Busca dados do usuário usando o token
  async function fetchUser(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('Token inválido')
      const data = await res.json()
      return data
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem('access')
    if (accessToken) {
      fetchUser(accessToken).then(data => {
        if (data) {
          setUser({ ...data, token: accessToken })
        } else {
          setUser(null)
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
        }
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (access, refresh, userData = null) => {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)

    if (userData) {
      setUser({ ...userData, token: access })
      setLoading(false)
      navigate('/home')
      return
    }

    const data = await fetchUser(access)
    if (data) {
      setUser({ ...data, token: access })
      setLoading(false)
      navigate('/home')
    } else {
      setUser(null)
      setLoading(false)
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      toast.error('Erro no login: usuário não encontrado')
    }
  }

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
    navigate('/auth')
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
