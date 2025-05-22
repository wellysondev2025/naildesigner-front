import React, { useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext' // ajuste o caminho conforme sua estrutura

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const resetForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setPhone('')
  }

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (response.ok) {
        const tokens = data
        const userRes = await fetch('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${tokens.access}` },
        })
        const userData = await userRes.json()

        login(tokens.access, tokens.refresh, userData) // salva user completo
        alert('Login realizado com sucesso!')
        navigate('/home')
      } else {
        alert('Erro no login. Verifique seus dados.')
      }
    } catch (error) {
      alert('Erro de conexão.')
      console.error(error)
    }
  }

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert('As senhas não coincidem.')
      return
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          confirm_password: confirmPassword,  // aqui!
          phone,
          is_nail_designer: false,
        }),
      })
      const data = await response.json()
      if (response.ok) {
        alert('Cadastro realizado! Faça login.')
        setIsLogin(true)
        resetForm()
      } else {
        alert('Erro ao cadastrar. Verifique os campos.')
        console.log(data)
      }
    } catch (error) {
      alert('Erro de conexão.')
      console.error(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    isLogin ? handleLogin() : handleRegister()
  }

  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-pink-500">
              {isLogin ? 'Login' : 'Cadastro'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Usuário</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
                  placeholder="nome_de_usuario"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
                      placeholder="email@email.com"
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
                  placeholder="••••••••"
                />
              </div>

              {!isLogin && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                {isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              {isLogin ? 'Novo por aqui?' : 'Já tem conta?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  resetForm()
                }}
                className="text-pink-500 hover:underline"
              >
                {isLogin ? 'Cadastre-se' : 'Fazer login'}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AuthForm
