import { useState, useEffect } from 'react'
import { Messages } from '../types'
const apiUrl = import.meta.env.VITE_API_URL;

export default function useMessages () {
  const [messages, setMessages] = useState<Messages[]>([])
  useEffect(() => {
    async function getMessages () {
      try {
        const response = await fetch(`${apiUrl}/messages/messages`, {
          method: 'GET',
          credentials: 'include' 
        })
        const res:Messages[] = await response.json()
        setMessages(res)
      } catch (error) {
        console.error('Error fetching data:', error) 
      }
    }

    getMessages()
  }, [])
  return { messages,setMessages }
}
