import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL;

export function useProfile() {
  const [user, setUser] = useState(null)
  const [address, setAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(json => {
        const u = json.data
        setUser(u)
        setAddress(u?.address || '')
        setPaymentMethod(u?.paymentMethod || '')
      })
      .finally(() => setLoading(false))
  }, [token])

  const save = async () => {
    setSaving(true)
    const res = await fetch(`${API}/users/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ address, paymentMethod }),
    })
    const json = await res.json()
    setUser(json.data)
    setSaving(false)
  }

  return { user, address, setAddress, paymentMethod, setPaymentMethod, loading, saving, save }
}