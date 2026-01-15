import { myState } from "@/Reducers/UserReducer"
import { Following, User } from "@/types"
import onHandletFollow from "./onHandletFollow"
import onHandleFollow from "./onHandleFollow"

export async function toggleFollow(beFollow:User,userSession:User,state:myState,unfollowAction:(userId:string)=>void,followAction:(follower:Following)=>void){
   const userFound = state.following.find(  (f) =>   f.following_id === userSession?.id &&       f.follower_id === beFollow.id )
   console.log(userFound);
   
     if (userFound) 
    {
      const follow=await onHandletFollow(userFound.id)
      unfollowAction(follow.id)
      } else 
        {
     const follow=await onHandleFollow(beFollow.id, userSession.id)
     
    followAction(follow)
     console.log(follow,"follow",state);
                        
     }
}