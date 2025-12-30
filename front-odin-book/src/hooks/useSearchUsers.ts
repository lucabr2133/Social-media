import { useEffect, useState } from 'react'
const apiUrl = import.meta.env.VITE_API_URL;

export function useSearchUser () {
  const [loading, setLoading] = useState(false)
  const [users,setUsers]=useState<User[]>([])
  const [input,setInputValue]=useState('')


  useEffect(() => {
    const controller = new AbortController()

    const timeout = setTimeout(async () => {
      setLoading(true)

      try {
        const res = await fetch(
        `${apiUrl}/logins/users?username=${input}`,
        { signal: controller.signal }
        )

        if (!res.ok) throw new Error('Error en búsqueda')

        const data = await res.json()

        setUsers(data)
        setLoading(false)
      } catch (err) {
        setLoading(false)
        console.error(err)
      }
    }, 300)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [input])
  return {loading,users,input,setInputValue}
}
