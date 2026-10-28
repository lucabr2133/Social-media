import React, { useContext, useEffect, useRef, useState } from 'react'
import useMessages from '../../hooks/useMessages.js'
import CreatePublication from '../CreatePublication/CreatePublication.tsx'
import onHandleMessageSubmit from '../../../services/onHandleMessageSubmit.js'
import { UserContext, UserSession } from '../../contex/context.js'
import MainHeader from '../Header/Header.tsx'
import { Messages as messages, User } from '../../types.js'
import { socket } from '../../socket.js'
import { MessageSquare, Send, Search, Smile, Circle } from 'lucide-react'
import { timeAgo } from '../../utils/timeAgo.js'

function Messages() {
  const contex = useContext(UserSession)
  if (!contex) throw new Error('you must put a valid provider')
  const { user } = contex

  const users = useContext(UserContext)
  const { messages: hookMessage, setMessages } = useMessages()
  const [receptorUser, setReceptorUser] = useState<User | null>(null)
  const [opendialog, setOpenDialog] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [contactSearch, setContactSearch] = useState('')
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
  const [isReceptorTyping, setIsReceptorTyping] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (user?.id) {
      socket.emit('joinRoom', user.id)

      const handleMessage = (message: messages) => {
        setMessages((prev) => {
          if (!prev) return []
          return [...prev, message]
        })
      }

      const handleOnlineUsers = (ids: string[]) => {
        setOnlineUserIds(ids)
      }

      const handleTyping = ({ from }: { from: string }) => {
        if (receptorUser && from === receptorUser.id) {
          setIsReceptorTyping(true)
        }
      }

      const handleStopTyping = ({ from }: { from: string }) => {
        if (receptorUser && from === receptorUser.id) {
          setIsReceptorTyping(false)
        }
      }

      socket.on('chat message', handleMessage)
      socket.on('online users', handleOnlineUsers)
      socket.on('typing', handleTyping)
      socket.on('stop typing', handleStopTyping)

      return () => {
        socket.off('chat message', handleMessage)
        socket.off('online users', handleOnlineUsers)
        socket.off('typing', handleTyping)
        socket.off('stop typing', handleStopTyping)
      }
    }
  }, [user?.id, receptorUser?.id, setMessages])

  // Reset typing when switching contacts
  useEffect(() => {
    setIsReceptorTyping(false)
  }, [receptorUser?.id])

  // Scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [hookMessage?.length, isReceptorTyping, receptorUser?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value)

    if (receptorUser && user) {
      socket.emit('typing', { from: user.id, to: receptorUser.id })

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop typing', { from: user.id, to: receptorUser.id })
      }, 1500)
    }
  }

  const addEmoji = (emoji: string) => {
    setMessageInput((prev) => prev + emoji)
  }

  if (!user || !users || !hookMessage) {
    return (
      <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white animate-spin" />
        <span className="text-xs font-medium text-zinc-400 tracking-wide">
          Loading messages...
        </span>
      </div>
    )
  }

  const otherUsers = users.filter((u) => u.id !== user.id)

  const filteredContacts = otherUsers.filter((u) =>
    u.username.toLowerCase().includes(contactSearch.toLowerCase())
  )

  const currentConversation = receptorUser
    ? hookMessage.filter(
        (message) =>
          (message.sender_id === user.id &&
            message.receptor_id === receptorUser.id) ||
          (message.sender_id === receptorUser.id &&
            message.receptor_id === user.id)
      )
    : []

  const isReceptorOnline = receptorUser
    ? onlineUserIds.includes(receptorUser.id)
    : false

  const emojis = ['👍', '❤️', '🔥', '😂', '🎉', '🚀', '✨', '🙌']

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex">
        <MainHeader userActive={user} setOpenDialog2s={setOpenDialog} />

        <div className="flex-1 w-full lg:pl-[max(15%,220px)] h-screen pb-16 lg:pb-0 flex flex-col">
          {/* Top Contacts Strip */}
          <header
            aria-label="Lista de usuarios"
            className="bg-[#121215] border-b border-white/[0.08] px-4 sm:px-6 py-2.5 flex items-center gap-3 overflow-x-auto shrink-0"
          >
            {/* Quick Contact Search */}
            <div className="relative shrink-0 w-36 sm:w-44">
              <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={contactSearch}
                onChange={(e) => setContactSearch(e.target.value)}
                placeholder="Find contact..."
                className="w-full h-7 pl-7 pr-2 rounded-lg bg-[#09090b] border border-white/10 text-[11px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="h-5 w-px bg-white/10 shrink-0" />

            {/* Contacts Pills */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {filteredContacts.map((user1) => {
                const isActive = receptorUser?.id === user1.id
                const isOnline = onlineUserIds.includes(user1.id)

                return (
                  <div
                    key={user1.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setReceptorUser(user1)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' && setReceptorUser(user1)
                    }
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shrink-0 select-none ${
                      isActive
                        ? 'bg-white text-zinc-950 border-white shadow-sm'
                        : 'bg-[#09090b] text-zinc-300 border-white/[0.08] hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        width={24}
                        height={24}
                        src={user1.profileImg || '/profile2.svg'}
                        alt={`${user1.username} profile`}
                        className="w-6 h-6 rounded-full object-cover border border-white/10"
                      />
                      {isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#09090b]" />
                      )}
                    </div>
                    <span className="truncate max-w-[100px] text-[11px]">
                      {user1.username}
                    </span>
                  </div>
                )
              })}
            </div>
          </header>

          {/* Chat Workspace */}
          <main className="flex-1 flex overflow-hidden p-3 sm:p-6">
            {receptorUser ? (
              <section
                aria-label={`Chat con ${receptorUser.username}`}
                className="flex-1 flex flex-col bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto w-full"
              >
                {/* Active Conversation Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08] bg-[#141418]">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={receptorUser.profileImg || '/profile2.svg'}
                        width={36}
                        height={36}
                        alt={`${receptorUser.username} profile`}
                        className="w-9 h-9 rounded-full object-cover border border-white/10"
                      />
                      {isReceptorOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#141418]" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white leading-tight">
                        {receptorUser.username}
                      </span>
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                        <Circle
                          className={`w-2 h-2 ${
                            isReceptorOnline
                              ? 'fill-emerald-400 text-emerald-400'
                              : 'fill-zinc-600 text-zinc-600'
                          }`}
                        />
                        <span>{isReceptorOnline ? 'Online' : 'Offline'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages Scroll Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-2.5">
                  {currentConversation.length > 0 ? (
                    currentConversation.map((message) => {
                      const isMine = message.sender_id === user.id
                      return (
                        <div
                          key={message.id}
                          className={`flex flex-col max-w-[80%] sm:max-w-[65%] ${
                            isMine ? 'self-end items-end' : 'self-start items-start'
                          }`}
                        >
                          <div
                            className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm leading-relaxed break-words shadow-sm ${
                              isMine
                                ? 'bg-white text-zinc-950 font-medium rounded-br-xs'
                                : 'bg-[#18181b] text-zinc-200 border border-white/[0.08] rounded-bl-xs'
                            }`}
                          >
                            {message.content}
                          </div>
                          {message.create_at && (
                            <span className="text-[10px] text-zinc-500 mt-1 px-1">
                              {timeAgo(message.create_at)}
                            </span>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-zinc-500 py-12">
                      <MessageSquare className="w-8 h-8 text-zinc-600 mb-2" />
                      No messages yet with {receptorUser.username}. Send the first message!
                    </div>
                  )}

                  {/* Typing Indicator */}
                  {isReceptorTyping && (
                    <div className="self-start flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#18181b] border border-white/[0.08] text-xs text-zinc-400 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      <span className="text-[11px] ml-1">
                        {receptorUser.username} is typing...
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Emoji Bar */}
                <div className="px-4 py-1.5 bg-[#0f0f12] border-t border-white/[0.04] flex items-center gap-1.5 overflow-x-auto">
                  <Smile className="w-3.5 h-3.5 text-zinc-500 mr-1 shrink-0" />
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => addEmoji(emoji)}
                      className="text-sm px-1.5 py-0.5 rounded-md hover:bg-white/[0.08] transition-colors cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {/* Message Composer */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!messageInput.trim()) return
                    onHandleMessageSubmit(e, user, receptorUser)
                    setMessageInput('')
                    if (user && receptorUser) {
                      socket.emit('stop typing', {
                        from: user.id,
                        to: receptorUser.id,
                      })
                    }
                  }}
                  method="POST"
                  aria-label="Enviar mensaje"
                  className="p-3 border-t border-white/[0.08] bg-[#141418] flex items-center gap-2"
                >
                  <input
                    type="text"
                    name="message"
                    id="message"
                    value={messageInput}
                    onChange={handleInputChange}
                    placeholder={`Message ${receptorUser.username}...`}
                    required
                    className="flex-1 h-9 px-3.5 rounded-xl bg-[#09090b] border border-white/10 text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="submit"
                    role="grid"
                    disabled={!messageInput.trim()}
                    className="h-9 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND</span>
                  </button>
                </form>
              </section>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#121215] border border-white/[0.08] rounded-2xl max-w-4xl mx-auto w-full">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-zinc-400" />
                </div>
                <p className="text-sm font-semibold text-zinc-200">
                  Your Direct Messages
                </p>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                  Select any contact from the bar above or search by username to start a real-time conversation.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <CreatePublication opendialog={opendialog} setOpenDialog={setOpenDialog} />
    </>
  )
}

export { Messages }
