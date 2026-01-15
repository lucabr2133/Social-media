import { User } from "@/types";
import { myState, UsemyActions } from '../../Reducers/UserReducer'
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Link } from "react-router-dom";
import { toggleFollow } from '../../../services/onHandleToggleFollow'
import { useFollow } from "../../contex/FollowContext";

export default function FollowingList ({users,user,state}:{users:User[],user:User,state:myState} ){
  const { followAction, unfollowAction, isFollowing } = useFollow()

  return (
    <>
      {users.map((userl) => (
              <div
                key={userl.id}
                className='
                        group
                        flex items-center justify-between
                        p-3
                        rounded-2xl
                        bg-neutral-900/60
                        border border-transparent
                        hover:border-amber-600/50
                        hover:bg-neutral-800/70
                        transition-all duration-300
                        hover:scale-105
      '
              >
                <div className='flex items-center gap-3'>
                  <Link
                    to={`/profile/${userl.username}`}
                    className='rounded-full hover:bg-transparent!'
                  >
                    <Avatar className='size-10 ring-2 ring-neutral-700 group-hover:ring-amber-500  transition'>
                      <AvatarImage src={userl.profileImg || '/profile2.svg'} />
                      <AvatarFallback />
                    </Avatar>
                  </Link>

                  <h2 className='text-sm font-semibold capitalize text-neutral-100'>
                    {userl.username}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    toggleFollow(userl, user, state, unfollowAction, followAction)
                  }}
                  className={`
          h-8 px-4
          text-xs font-semibold capitalize
          rounded-full
         ${isFollowing(userl.id, user.id) ? 'bg-red-600!' : 'bg-blue-600!'}
          text-white
          hover:from-blue-600 hover:to-blue-700
          shadow-md
          transition-all duration-300
        `}
                >
                  {isFollowing(userl.id, user.id) ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))}
    </>
  )
}
