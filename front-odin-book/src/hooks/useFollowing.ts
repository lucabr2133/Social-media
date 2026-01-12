import { useEffect, useState } from 'react'
import { ErrorInterface, errorMesagges, Following } from '../types'
import { UsemyActions } from '../Reducers/UserReducer'
const apiUrl = import.meta.env.VITE_API_URL

function useFollowing () {
  const { setAction } = UsemyActions()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const controller = new AbortController()

    async function getFollowing () {
      try {
        setLoading(true)
        const response = await fetch(`${apiUrl}/followings/following`, {
          signal: controller.signal
        })
        const data = await response.json()
        if (!response.ok){ 
         const error= data as ErrorInterface  
          throw new Error(error.message)
        }
          
    const following = data as Following[]
        setAction(following)
      } finally {
        setLoading(false)
      }
    }
    getFollowing()
  }, [setAction])
  return { loading }
}
export default useFollowing
