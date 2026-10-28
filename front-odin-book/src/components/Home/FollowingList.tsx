import React from 'react'
import { User } from '../../types'
import { toggleFollow } from '../../../services/onHandleToggleFollow'
import { useFollow } from '../../contex/FollowContext'
import { Link } from 'react-router'

interface props {
  users: User[]
  user: User
}

export default function FollowingList({ users, user }: props) {
  const { state, followAction, unfollowAction, isFollowing } = useFollow()

  const suggestedUsers = users
    .filter((u) => u.username !== user.username)
    .slice(0, 6)

  return (
    <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Suggested for you
        </h2>
        <Link
          to="/Users"
          className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          See all
        </Link>
      </div>

      <div className="flex flex-col gap-3.5">
        {suggestedUsers.map((userl) => {
          const following = isFollowing(userl.id, user.id)
          return (
            <div
              key={userl.id}
              className="flex items-center justify-between gap-3"
            >
              <Link
                to={`/profile/${userl.username}`}
                className="flex items-center gap-3 min-w-0 group"
              >
                <img
                  width={36}
                  height={36}
                  src={userl.profileImg || '/profile2.svg'}
                  alt={`${userl.username} profile`}
                  className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-white truncate group-hover:underline">
                    {userl.username}
                  </span>
                  <span className="text-[11px] text-zinc-500 truncate">
                    Member
                  </span>
                </div>
              </Link>

              <button
                type="button"
                aria-label="Follow"
                onClick={async () => {
                  toggleFollow(userl, user, state, unfollowAction, followAction)
                }}
                className={`h-7 px-3 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  following
                    ? 'bg-white/[0.06] text-zinc-300 hover:bg-rose-500/15 hover:text-rose-300 border border-white/10'
                    : 'bg-white text-zinc-950 hover:bg-zinc-200 font-semibold'
                }`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
