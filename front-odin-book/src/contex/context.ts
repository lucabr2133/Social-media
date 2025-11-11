import { createContext } from 'react'
import { User } from '../types'
import { myState ,myAction} from '../Reducers/PublicationReducer'
import React from 'react'
export interface UserSessionContextType {
  user: User |null
  loading:boolean
}
interface PublicationContextI{
  state:myState,
  dispatch: React.Dispatch<myAction>;
}
const UserContext = createContext<User[]|null>(null)
const UserSession = createContext<UserSessionContextType|null>(null)
const PublicationContext = createContext<PublicationContextI|undefined>(undefined)
export { UserContext, UserSession, PublicationContext }
