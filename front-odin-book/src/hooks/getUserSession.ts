import { useState, useEffect } from 'react'
import { User } from '../types'
import { data } from '../types'

function useUserSession () {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    async function getData () {
      try {
        const res = await fetch(`${apiUrl}/logins/`, {
          credentials: 'include',
        })

        if (res.ok) {
          const data: data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [apiUrl])

  return { user, loading, setUser }
}

export default useUserSession
