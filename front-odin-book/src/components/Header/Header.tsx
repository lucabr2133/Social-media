import React, { useEffect, useState } from 'react'
import { socket } from '../../socket'
import { Notification, User } from '../../types'
import { useNotifications } from '../../hooks/useNotifications'
import { onHandleReadNotifications } from '../../../services/onHandleReadNotifactions'
import { Link, useLocation } from 'react-router'
import {
  Home,
  MessageSquare,
  PlusSquare,
  Users,
  Bell,
  X,
} from 'lucide-react'

interface props {
  setOpenDialog2s?: React.Dispatch<React.SetStateAction<boolean>>
  userActive: User
}

function MainHeader({ setOpenDialog2s, userActive }: props) {
  const [openNotification, setOpenNotification] = useState(false)
  const { notification, setNotifications } = useNotifications(userActive.id)
  const location = useLocation()

  useEffect(() => {
    socket.emit('NotificationRoom', userActive.id)
    socket.on('notifications', (data: Notification) => {
      setNotifications((prev) => [...prev, data])
    })
    return () => {
      socket.off('notifications')
    }
  }, [setNotifications, userActive.id])

  if (!notification) return null

  const unreadCount = notification.filter((item) => !item.read).length

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Desktop Left Sidebar + Mobile Bottom Navigation */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/[0.08] flex flex-row items-center justify-around px-2 lg:top-0 lg:bottom-0 lg:right-auto lg:w-[15%] lg:min-w-[220px] lg:max-w-[260px] lg:h-screen lg:flex-col lg:justify-between lg:items-stretch lg:border-t-0 lg:border-r lg:px-4 lg:py-6">
        {/* Brand Logo (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 px-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 font-bold text-sm flex items-center justify-center shadow-sm">
            OB
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white leading-none">
              Odin Book
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5">Social Feed</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-row lg:flex-col items-center lg:items-stretch justify-around w-full gap-1 lg:flex-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive('/')
                ? 'bg-white/[0.09] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Home</span>
          </Link>

          <Link
            to="/Messages"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive('/Messages')
                ? 'bg-white/[0.09] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Messages</span>
          </Link>

          {setOpenDialog2s && (
            <button
              type="button"
              onClick={() => setOpenDialog2s(true)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer text-left"
            >
              <PlusSquare className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">Create Post</span>
            </button>
          )}

          <Link
            to="/Users"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive('/Users')
                ? 'bg-white/[0.09] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span className="hidden lg:inline">Discover</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              onHandleReadNotifications(userActive.id)
              setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
              setOpenNotification((prev) => !prev)
            }}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer text-left ${
              openNotification
                ? 'bg-white/[0.09] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <div className="relative">
              <Bell className="w-5 h-5 shrink-0" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="hidden lg:inline">Notifications</span>
          </button>

          <Link
            to={`/profile/${userActive.username}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all lg:mt-auto ${
              location.pathname.startsWith('/profile')
                ? 'bg-white/[0.09] text-white'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <img
              src={userActive.profileImg || '/profile2.svg'}
              alt={userActive.username || 'Profile'}
              className="w-6 h-6 rounded-full object-cover border border-white/15 shrink-0"
            />
            <div className="hidden lg:flex flex-col min-w-0">
              <span className="text-xs font-semibold text-white truncate">
                {userActive.username}
              </span>
              <span className="text-[11px] text-zinc-500">View profile</span>
            </div>
          </Link>
        </nav>
      </aside>

      {/* Notifications Modal */}
      {openNotification && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpenNotification(false)}
        >
          <div
            className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-white">
                  Notifications
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpenNotification(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto divide-y divide-white/[0.06]">
              {notification.length > 0 ? (
                notification.map((notify) => (
                  <div
                    key={notify.id}
                    className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
                  >
                    <Link
                      to={`/profile/${notify.sender.username}`}
                      onClick={() => setOpenNotification(false)}
                      className="shrink-0"
                    >
                      <img
                        src={notify.sender.profileImg || '/profile2.svg'}
                        alt={notify.sender.username}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 text-xs text-zinc-300 leading-relaxed">
                      <Link
                        to={`/profile/${notify.sender.username}`}
                        onClick={() => setOpenNotification(false)}
                        className="font-semibold text-white hover:underline mr-1"
                      >
                        {notify.sender.username}
                      </Link>
                      <span>{notify.content}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 px-6 text-center text-xs text-zinc-500">
                  You&apos;re all caught up. No notifications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MainHeader
