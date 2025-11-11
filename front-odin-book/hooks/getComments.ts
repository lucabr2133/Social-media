import { useEffect, useState } from 'react'
import { Comments } from '../src/types'

function useComments () {
  const [comments, setComments] = useState<Comments[]|null>(null)

  useEffect(() => {
    async function getData () {
      const res = await fetch('http://localhost:3000/comments/comments')
      const data:Comments[] = await res.json()
      setComments(data)
    }
    getData()
  }, [])

  return { comments }
}
export default useComments
