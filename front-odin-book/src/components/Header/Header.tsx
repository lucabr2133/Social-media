import React, { useEffect, useState } from 'react'
import { socket } from '../../socket'
import { User, notifications as NotificationType } from '../../types'
import { useNotification } from '../../hooks/useNotifications'
import { onHandleReadNotification } from '../../../services/onHandleReadNotification'
import { Link, useLocation } from 'react-router'
import {
  Home,
  MessageSquare,
  PlusSquare,
  Users,
  Bell,
  X,
  Heart,
  UserPlus,
  CheckCheck,
  Radio,
} from 'lucide-react'
import { timeAgo } from '../../utils/timeAgo'

interface props {
  setOpenDialog2s?: React.Dispatch<React.SetStateAction<boolean>>
  userActive: User
}

function MainHeader({ setOpenDialog2s, userActive }: props) {
  const [openNotification, setOpenNotification] = useState(false)
  const { notifications, setNotification } = useNotification(userActive.id)
  const location = useLocation()

  useEffect(() => {
    if (!userActive?.id) return

    socket.emit('NotificationRoom', userActive.id)

    const handleNewNotify = (data: NotificationType) => {
      setNotification((prev) => (prev ? [data, ...prev] : [data]))
    }

    socket.on('notifications', handleNewNotify)

    return () => {
      socket.off('notifications', handleNewNotify)
    }
  }, [setNotification, userActive.id])

  const unreadCount = notifications
    ? notifications.filter((item) => !item.read).length
    : 0

  const isActive = (path: string) => location.pathname === path

  const handleMarkAsRead = async () => {
    await onHandleReadNotification(userActive.id)
    setNotification((prev) =>
      prev ? prev.map((item) => ({ ...item, read: true })) : []
    )
  }

  const getNotificationText = (item: NotificationType) => {
    if (item.type === 'like') return 'liked your post'
    if (item.type === 'comment') return 'commented on your post'
    if (item.type === 'follow') return 'started following you'
    return item.message || 'interacted with your account'
  }

  const getNotificationIcon = (type: string) => {
    if (type === 'like') {
      return <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
    }
    if (type === 'comment') {
      return <MessageSquare className="w-3 h-3 text-sky-400" />
    }
    return <UserPlus className="w-3 h-3 text-emerald-400" />
  }

  return (
    <>
      {/* Desktop Left Sidebar + Mobile Bottom Navigation */}
      <aside className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/[0.08] flex flex-row items-center justify-around px-2 lg:top-0 lg:bottom-0 lg:right-auto lg:w-[15%] lg:min-w-[220px] lg:max-w-[260px] lg:h-screen lg:flex-col lg:justify-between lg:items-stretch lg:border-t-0 lg:border-r lg:px-4 lg:py-6">
        {/* Brand Logo (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 px-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-white text-zinc-950 font-bold text-sm flex items-center justify-center shadow-sm">
            <Radio className="w-4 h-4 text-zinc-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-white leading-none">
              Echo
            </span>
            <span className="text-[11px] text-zinc-500 mt-0.5">Social Platform</span>
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
            to="/messages"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive('/messages')
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
            to="/users"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive('/users')
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
              setOpenNotification((prev) => !prev)
              if (unreadCount > 0) {
                handleMarkAsRead()
              }
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
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAsRead}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpenNotification(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto divide-y divide-white/[0.06]">
              {notifications && notifications.length > 0 ? (
                notifications.map((notify) => (
                  <div
                    key={notify.id}
                    className={`flex items-center gap-3.5 px-5 py-3.5 transition-colors ${
                      !notify.read ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Link
                        to={`/profile/${notify.actor?.username}`}
                        onClick={() => setOpenNotification(false)}
                      >
                        <img
                          src={notify.actor?.profileImg || '/profile2.svg'}
                          alt={notify.actor?.username || 'User'}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                      </Link>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#18181b] border border-white/15 flex items-center justify-center">
                        {getNotificationIcon(notify.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 text-xs text-zinc-300 leading-relaxed">
                      <div>
                        <Link
                          to={`/profile/${notify.actor?.username}`}
                          onClick={() => setOpenNotification(false)}
                          className="font-semibold text-white hover:underline mr-1"
                        >
                          {notify.actor?.username}
                        </Link>
                        <span>{getNotificationText(notify)}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">
                        {timeAgo(notify.createdAt)}
                      </span>
                    </div>

                    {!notify.read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    )}
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
