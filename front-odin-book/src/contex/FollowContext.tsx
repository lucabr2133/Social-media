import { createContext, useContext, ReactNode, useReducer } from 'react'
import { Following } from '@/types'
import { userReducer } from '../Reducers/UserReducer'
import React from 'react'
interface FollowContextType {
  state: { following: Following[] }
  setAction: (followers: Following[]) => void
  followAction: (follower: Following) => void
  unfollowAction: (id: string) => void
  isFollowing:(beFollow:string,userId:string)=>boolean
}

const FollowContext = createContext<FollowContextType | null>(null)

export function FollowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, { following: [] })

  const setAction = (followers: Following[]) =>
    dispatch({ type: 'set', followers })

  const followAction = (follower: Following) =>
    dispatch({ type: 'follow', follower })

  const unfollowAction = (id: string) =>
    dispatch({ type: 'unfollow', followId: id })
const isFollowing = (userId: string,userSessionId:string) =>{
      return state.following.some(
      (f) => f.following_id === userSessionId&& f.follower_id === userId
    )
  }
  return (
    <FollowContext.Provider
      value={{ state, setAction, followAction, unfollowAction ,isFollowing}}
    >
      {children}
    </FollowContext.Provider>
  )
}

export function useFollow() {
  const ctx = useContext(FollowContext)
  if (!ctx) throw new Error('useFollow must be used inside FollowProvider')
  return ctx
}
