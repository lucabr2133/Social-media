import { Following, Publications, User } from '../../types'
import DialogUpdateProfile from './DialogUpdateProfile'
import React, { useState } from 'react'
import { LogOut, Settings, UserPlus, UserCheck, MessageSquare, X } from 'lucide-react'
import { useFollow } from '../../contex/FollowContext'
import { toggleFollow } from '../../../services/onHandleToggleFollow'
import { Link, useNavigate } from 'react-router'

interface Props {
  data: {
    userData: User
    userSession: User
    publications: Publications[]
    following: Following[]
  }
  actions: {
    setUserData: React.Dispatch<React.SetStateAction<User | null>>
  }
  styles: Record<string, string>
  usernameParam: string
  allUsers?: User[]
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Header({ data, actions, usernameParam, allUsers = [] }: Props) {
  const { userData, userSession, publications, following } = data
  const { setUserData } = actions
  const [openDialog, setOpenDialog] = useState(false)
  const [modalType, setModalType] = useState<'followers' | 'following' | null>(null)

  const { state: followState, followAction, unfollowAction, isFollowing } = useFollow()
  const navigate = useNavigate()

  function onHandleLogout() {
    localStorage.removeItem('token')
    fetch(`${apiUrl}/logins/logout`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        window.location.href = data.redirectUrl || '/login'
      })
      .catch((error) => console.error('Error logging out:', error))
  }

  const isOwner = userSession.id === userData.id
  const isTargetFollowed = isFollowing(userData.id, userSession.id)

  const followersRelations = following.filter((f) => f.follower_id === userData.id)
  const followingRelations = following.filter((f) => f.following_id === userData.id)

  const followersCount = followersRelations.length
  const followingCount = followingRelations.length

  // Find users for the modal
  const modalUsers: User[] = (
    modalType === 'followers'
      ? followersRelations.map((f) => allUsers.find((u) => u.id === f.following_id)).filter(Boolean)
      : followingRelations.map((f) => allUsers.find((u) => u.id === f.follower_id)).filter(Boolean)
  ) as User[]

  return (
    <>
      <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        {/* Avatar */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-white/15 bg-[#09090b] shrink-0 shadow-lg">
          <img
            src={userData.profileImg || '/profile2.svg'}
            alt={usernameParam}
            className="w-full h-full object-cover"
          />
        </div>

        {/* User Details */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {usernameParam}
              </h1>
              {userData.description && (
                <p className="text-sm text-zinc-400 mt-1 max-w-lg">
                  {userData.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            {isOwner ? (
              <div className="flex items-center gap-2.5 self-center sm:self-start">
                <button
                  type="button"
                  onClick={() => setOpenDialog(true)}
                  className="h-9 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Edit Profile</span>
                </button>
                <button
                  type="button"
                  onClick={onHandleLogout}
                  className="h-9 px-3.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium text-rose-300 inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 self-center sm:self-start">
                <button
                  type="button"
                  onClick={() => {
                    toggleFollow(userData, userSession, followState, unfollowAction, followAction)
                  }}
                  className={`h-9 px-4 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                    isTargetFollowed
                      ? 'bg-white/[0.08] text-zinc-300 hover:bg-rose-500/15 hover:text-rose-300 border border-white/10'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  {isTargetFollowed ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/messages')}
                  className="h-9 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Message</span>
                </button>
              </div>
            )}
          </div>

          {/* Metrics Row (Interactive) */}
          <div className="flex items-center gap-8 pt-4 border-t border-white/[0.06] w-full justify-center sm:justify-start">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white tabular-nums">
                {publications.length}
              </span>
              <span className="text-xs text-zinc-400">Posts</span>
            </div>

            <button
              type="button"
              onClick={() => setModalType('followers')}
              className="flex items-baseline gap-1.5 text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-base font-bold text-white tabular-nums">
                {followersCount}
              </span>
              <span className="text-xs text-zinc-400">Followers</span>
            </button>

            <button
              type="button"
              onClick={() => setModalType('following')}
              className="flex items-baseline gap-1.5 text-left hover:opacity-80 transition-opacity cursor-pointer"
            >
              <span className="text-base font-bold text-white tabular-nums">
                {followingCount}
              </span>
              <span className="text-xs text-zinc-400">Following</span>
            </button>
          </div>
        </div>
      </div>

      {/* Followers / Following List Modal */}
      {modalType && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalType(null)}
        >
          <div
            className="w-full max-w-sm bg-[#121215] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col max-h-[60vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-semibold text-white capitalize">
                {modalType} ({modalType === 'followers' ? followersCount : followingCount})
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-white/[0.06] py-2">
              {modalUsers.length > 0 ? (
                modalUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between py-2.5">
                    <Link
                      to={`/profile/${u.username}`}
                      onClick={() => setModalType(null)}
                      className="flex items-center gap-3 min-w-0 group"
                    >
                      <img
                        src={u.profileImg || '/profile2.svg'}
                        alt={u.username}
                        className="w-8 h-8 rounded-full object-cover border border-white/10"
                      />
                      <span className="text-xs font-semibold text-white group-hover:underline truncate">
                        {u.username}
                      </span>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-zinc-500">
                  No users found in this list.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <DialogUpdateProfile
        user={userData}
        userParams={usernameParam}
        setUserData={setUserData}
        openDialgo={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  )
}

export default Header
