import { useEffect, useState } from 'react'
import { Comments } from '../types'

function useComments(publicationId: string) {
  const [comments, setComments] = useState<Comments[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (!publicationId) return

    const controller = new AbortController()

    setLoading(true)
    setError(null)

    async function getData() {
      try {
        const res = await fetch(
          `${apiUrl}/comments/comments?publicationId=${publicationId}`,
          { signal: controller.signal }
        )

        if (!res.ok) throw new Error("Error fetching comments")

        const data: Comments[] = await res.json()
        setComments(data)
      } catch (err) {
  if (err instanceof Error) {
    if (err.name !== "AbortError") {
      setError("No se pudieron cargar los comentarios")
    }
  }
}
finally {
        setLoading(false)
      }
    }

    getData()

    return () => controller.abort()
  }, [apiUrl, publicationId])

  return { comments, setComments, loading, error }
}

export default useComments
