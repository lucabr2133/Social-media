import { Following, Publications, User } from '../../types'
import DialogUpdateProfile from './DialogUpdateProfile'
import React, { useState } from 'react'
import { LogOut, Settings } from 'lucide-react'

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
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function Header({ data, actions, usernameParam }: Props) {
  const { userData, userSession, publications, following } = data
  const { setUserData } = actions
  const [openDialog, setOpenDialog] = useState(false)

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
  const followersCount = following.filter(
    (f) => f.follower_id === userData.id
  ).length
  const followingCount = following.filter(
    (f) => f.following_id === userData.id
  ).length

  return (
    <>
      <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
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

            {isOwner && (
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
            )}
          </div>

          {/* Metrics Row */}
          <div className="flex items-center gap-8 pt-4 border-t border-white/[0.06] w-full justify-center sm:justify-start">
            {[
              { value: publications.length, label: 'Posts' },
              { value: followersCount, label: 'Followers' },
              { value: followingCount, label: 'Following' },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-white tabular-nums">
                  {value}
                </span>
                <span className="text-xs text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
