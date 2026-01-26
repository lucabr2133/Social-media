import { createContext, SetStateAction } from 'react'
import { User } from '../types'
import React from 'react'
export interface UserSessionContextType {
  user: User |null,
  setUser:React.Dispatch<SetStateAction<User|null>>
  loading:boolean
}

const UserContext = createContext<User[]|null>(null)
const UserSession = createContext<UserSessionContextType|null>(null)
export { UserContext, UserSession }
