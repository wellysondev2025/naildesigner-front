// src/api.js
export function authFetch(url, options = {}) {
  const token = localStorage.getItem('access')
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  return fetch(url, { ...options, headers })
}
