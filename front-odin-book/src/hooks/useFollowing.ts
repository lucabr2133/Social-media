import { useFollow } from '../contex/FollowContext'
import { ErrorInterface, Following } from '@/types'
import { useEffect, useState } from 'react'
const url= import.meta.env.VITE_API_URL
export function useFollowing() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
   const { state, setAction } = useFollow()
  useEffect(() => {
    const controller = new AbortController()

    const fetchFollowing = async () => {
      try {
        setLoading(true)

        const response = await fetch(`${url}/followings/following`, {
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
  }, [])

  return { state, loading, error }
}