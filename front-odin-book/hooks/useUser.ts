import { useEffect, useState } from 'react'
import {User} from '../src/types'
function useUser (username:string|undefined) {
  if(!username) throw new Error("username must be a string")
  const [user, setUser] = useState<User|null>(null)
  useEffect(() => {
    async function getUser () {
      const res = await fetch(`http://localhost:3000/logins/profile/${username}`)
      const data = await res.json()

      setUser(data)
    }
    getUser()
  }, [username])
  return { user }
}
export default useUser
