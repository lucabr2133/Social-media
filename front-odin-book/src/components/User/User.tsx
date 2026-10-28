import { useFollowing } from '../../hooks/useFollowing'
import CreatePublication from '../CreatePublication/CreatePublication'
import MainHeader from '../Header/Header'
import { UserSession } from '../../contex/context'
import React, { useContext, useState } from 'react'
import { SpinnerComponnet } from '../ui/spinner'
import { useSearchUser } from '../../hooks/useSearchUsers'
import { toggleFollow } from '../../../services/onHandleToggleFollow'
import { useFollow } from '../../contex/FollowContext'
import { Link, useNavigate } from 'react-router'
import { Search, MessageSquare, Sparkles, Users as UsersIcon } from 'lucide-react'

export function Users() {
  const contextUserSession = useContext(UserSession)
  if (!contextUserSession) {
    throw new Error('you must provide the correct value types')
  }
  const { user } = contextUserSession
  const { loading: followLoading } = useFollowing()
  const { state, followAction, unfollowAction, isFollowing } = useFollow()
  const [opendialog, setOpenDialog] = useState(false)
  const { input, loading, setInputValue, users } = useSearchUser()
  const [filterMode, setFilterMode] = useState<'all' | 'unfollowed'>('all')
  const navigate = useNavigate()

  if (!users || !user || followLoading) {
    return (
      <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white animate-spin" />
        <span className="text-xs font-medium text-zinc-400 tracking-wide">
          Loading directory...
        </span>
      </div>
    )
  }

  const baseUsers = users.filter((u) => u.username !== user.username)

  const displayedUsers = baseUsers.filter((u) => {
    if (filterMode === 'unfollowed') {
      return !isFollowing(u.id, user.id)
    }
    return true
  })

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex">
        <MainHeader userActive={user} setOpenDialog2s={setOpenDialog} />

        <div className="flex-1 w-full lg:pl-[max(15%,220px)] pb-20 lg:pb-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 lg:pt-8">
            {/* Page Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-6">
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Discover People
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Find and connect with creators and members on Echo
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Filter Switcher */}
                <div className="flex items-center p-1 bg-[#121215] border border-white/[0.08] rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      filterMode === 'all'
                        ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    All ({baseUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterMode('unfollowed')}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      filterMode === 'unfollowed'
                        ? 'bg-white text-zinc-950 font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Suggestions</span>
                  </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    value={input}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                    type="text"
                    placeholder="Search user..."
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl bg-[#121215] border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-3 py-8 text-xs text-zinc-400">
                <SpinnerComponnet />
                <span>Searching users...</span>
              </div>
            )}

            {/* Users Grid */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
                loading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {displayedUsers.length > 0 ? (
                displayedUsers.map((userl) => {
                  const following = isFollowing(userl.id, user.id)
                  return (
                    <div
                      key={userl.id}
                      className="bg-[#121215] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <Link
                          to={`/profile/${userl.username}`}
                          className="shrink-0 group"
                        >
                          <img
                            src={userl.profileImg || '/profile2.svg'}
                            alt={`${userl.username} profile`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover border border-white/10 group-hover:border-white/30 transition-colors"
                          />
                        </Link>
                        <div className="flex flex-col min-w-0 flex-1">
                          <Link
                            to={`/profile/${userl.username}`}
                            className="text-sm font-semibold text-white hover:underline truncate"
                          >
                            {userl.username}
                          </Link>
                          <span className="text-xs text-zinc-400 line-clamp-2 mt-0.5">
                            {userl.description || 'Echo community member'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.05]">
                        <button
                          type="button"
                          onClick={async () => {
                            toggleFollow(
                              userl,
                              user,
                              state,
                              unfollowAction,
                              followAction
                            )
                          }}
                          className={`flex-1 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            following
                              ? 'bg-white/[0.06] text-zinc-300 hover:bg-rose-500/15 hover:text-rose-300 border border-white/10'
                              : 'bg-white text-zinc-950 hover:bg-zinc-200'
                          }`}
                        >
                          {following ? 'Following' : 'Follow'}
                        </button>

                        <button
                          type="button"
                          title="Message user"
                          onClick={() => navigate('/messages')}
                          className="h-8 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full bg-[#121215] border border-white/[0.08] rounded-2xl p-12 text-center text-xs text-zinc-500">
                  {filterMode === 'unfollowed'
                    ? "You are already following everyone! Check back later for new members."
                    : 'No users found matching your search.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CreatePublication opendialog={opendialog} setOpenDialog={setOpenDialog} />
    </>
  )
}
