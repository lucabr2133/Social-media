import useFollowing from "@/hooks/useFollowing"
import { Following } from "@/types"
import { useEffect, useReducer } from "react"

interface myState{
  following:Following[]
}
interface actionFollow{
  type:'follow',
  follower:Following
}
interface actionUnfollow{
  type:'unfollow',
  followId:string
}
interface actionSet{
  type:'set',
  followers:Following[]
}
type myAction = actionFollow|actionUnfollow|actionSet
export function userReducer(state:myState,action:myAction){
 switch (action.type) {
    case 'follow':
      return {
        ...state,
        following: [...state.following, action.follower]
      }
    case 'unfollow':
      return {
        ...state,
        following: state.following.filter(follow => follow.id !== action.followId)
      }
      case 'set':
        return{
          ...state,
        following:action.followers
        }
    default:
      return state
  }
}
export function UsemyActions(){
    
      const [state,dispatch]=useReducer(userReducer,{following:[]})
    
     const setAction=(following:Following[])=>{
            dispatch({ type: 'set', followers: following })
        
    }
    const followAction=(follower:Following)=>{
        dispatch({type:'follow',follower})
    }
    const unfollowAction=(followId:string)=>{
        dispatch({type:'unfollow',followId})
    }
    return {setAction,followAction,unfollowAction,state}
}