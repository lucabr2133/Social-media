import { useEffect, useState } from 'react'
import { Following } from '../src/types'

function useFollowing () {
  const [following, setFollowing] = useState<Following[]|null>(null)
  useEffect(() => {
    async function getFollowing () {
      const data = await fetch('http://localhost:3000/followings/following')
      const res:Following[] = await data.json()
      setFollowing(res)
    }
    getFollowing()
  }, [])
  return { following }
}
export default useFollowing
