import { useEffect } from 'react'
import { socket } from '../socket'

export function useChatSocket () {
  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])
}
