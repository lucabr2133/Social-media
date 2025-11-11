import { useEffect, useState } from 'react'
import { Likes } from '../src/types'

export default function useLikesPublication () {
  const [publicationLikes, setPublicationLikes] = useState<Likes[]|null>(null)

  useEffect(() => {
    async function getLikesPublication () {
      const data = await fetch('http://localhost:3000/likes/likes')
      const response:Likes[] = await data.json()
      setPublicationLikes(response)
    }
    getLikesPublication()
  }, [])
  return { publicationLikes }
}
