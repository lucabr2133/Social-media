import { useEffect, useState } from 'react'
import { User } from '../src/types'

function useUsers () {
  const [users, setUsers] = useState<User[]|null>(null)
  useEffect(() => {
    async function getAllUsers () {
      const data = await fetch('http://localhost:3000/logins/users')
      const res:User[] = await data.json()
      setUsers(res)
    }
    getAllUsers()
  }, [])

  return { users }
}

export default useUsers
