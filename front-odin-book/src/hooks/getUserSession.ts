import { useState, useEffect } from 'react'
import { User } from '../types'
import {data} from '../types'
function useUserSession () {
const apiUrl = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    async function getData () {
      try {
        const res = await fetch(`${apiUrl}/logins/`, {
          credentials: 'include',
        })
        
        if (res.ok) {
          const data:data = await res.json()
          setUser(data.user) // Asigna el usuario recibido
        } else {
          setUser(null) // Si no hay usuario, establece a null
        }
      } catch (error) {
        setUser(null) // En caso de error, establece el usuario como null
      } finally {
        setLoading(false) // Marca la carga como completada
      }
    }

    getData()
  }, [apiUrl]) 

  return { user, loading, setUser }
}

export default useUserSession
