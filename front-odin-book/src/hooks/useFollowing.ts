import { UsemyActions } from '@/Reducers/UserReducer'
import { ErrorInterface, Following } from '@/types'
import { useEffect, useState } from 'react'

export function useFollowing() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {state,setAction}=UsemyActions()
  useEffect(() => {
    const controller = new AbortController()

    const fetchFollowing = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/following', {
          signal: controller.signal
        })

        const json = await response.json()

        if (!response.ok) {
          const err = json as ErrorInterface
          throw new Error(err.message)
        }

        setAction(json as Following[])
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return

        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowing()

    return () => controller.abort()
  }, [setAction])

  return { state, loading, error }
}