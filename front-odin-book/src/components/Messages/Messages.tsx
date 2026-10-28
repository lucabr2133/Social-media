import React, { useContext, useEffect, useState } from 'react'
import useMessages from '../../hooks/useMessages.js'
import CreatePublication from '../CreatePublication/CreatePublication.tsx'
import onHandleMessageSubmit from '../../../services/onHandleMessageSubmit.js'
import { UserContext, UserSession } from '../../contex/context.js'
import MainHeader from '../Header/Header.tsx'
import { Messages as messages, User } from '../../types.js'
import { socket } from '../../socket.js'
import { MessageSquare, Send } from 'lucide-react'

function Messages() {
  const contex = useContext(UserSession)
  if (!contex) throw new Error('you must put a valid provider')
  const { user } = contex

  const users = useContext(UserContext)
  const { messages: hookMessage, setMessages } = useMessages()
  const [receptorUser, setReceptorUser] = useState<User | null>(null)
  const [opendialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (user?.id) {
      socket.emit('joinRoom', user.id)
      const handleMessage = (message: messages) => {
        setMessages((prev) => {
          if (!prev) return []
          return [...prev, message]
        })
      }
      socket.on('chat message', handleMessage)
      return () => {
        socket.off('chat message', handleMessage)
      }
    }
  }, [user?.id, setMessages])

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

  const currentConversation = receptorUser
    ? hookMessage.filter(
        (message) =>
          (message.sender_id === user.id &&
            message.receptor_id === receptorUser.id) ||
          (message.sender_id === receptorUser.id &&
            message.receptor_id === user.id)
      )
    : []

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex">
        <MainHeader userActive={user} setOpenDialog2s={setOpenDialog} />

        <div className="flex-1 w-full lg:pl-[max(15%,220px)] h-screen pb-16 lg:pb-0 flex flex-col">
          {/* Top Contacts Strip */}
          <header
            aria-label="Lista de usuarios"
            className="bg-[#121215] border-b border-white/[0.08] px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto shrink-0"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mr-1 shrink-0">
              Contacts
            </span>

            {otherUsers.map((user1) => {
              const isActive = receptorUser?.id === user1.id
              return (
                <div
                  key={user1.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setReceptorUser(user1)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && setReceptorUser(user1)
                  }
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer shrink-0 select-none ${
                    isActive
                      ? 'bg-white text-zinc-950 border-white shadow-sm'
                      : 'bg-[#09090b] text-zinc-300 border-white/[0.08] hover:border-white/20 hover:text-white'
                  }`}
                >
                  <img
                    width={28}
                    height={28}
                    src={user1.profileImg || '/profile2.svg'}
                    alt={`${user1.username} profile`}
                    className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <span className="truncate max-w-[110px]">
                    {user1.username}
                  </span>
                </div>
              )
            })}
          </header>

          {/* Chat Workspace */}
          <main className="flex-1 flex overflow-hidden p-4 sm:p-6">
            {receptorUser ? (
              <section
                aria-label={`Chat con ${receptorUser.username}`}
                className="flex-1 flex flex-col bg-[#121215] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg max-w-4xl mx-auto w-full"
              >
                {/* Active Conversation Header */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.08] bg-[#141418]">
                  <img
                    src={receptorUser.profileImg || '/profile2.svg'}
                    width={38}
                    height={38}
                    alt={`${receptorUser.username} profile`}
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {receptorUser.username}
                    </span>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      Direct message
                    </span>
                  </div>
                </div>

                {/* Messages Scroll Container */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
                  {currentConversation.length > 0 ? (
                    currentConversation.map((message) => {
                      const isMine = message.sender_id === user.id
                      return (
                        <div
                          key={message.id}
                          className={`max-w-[75%] sm:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                            isMine
                              ? 'self-end bg-white text-zinc-950 font-medium rounded-br-sm'
                              : 'self-start bg-[#18181b] text-zinc-200 border border-white/[0.08] rounded-bl-sm'
                          }`}
                        >
                          {message.content}
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-zinc-500">
                      No messages yet with {receptorUser.username}. Say hello!
                    </div>
                  )}
                </div>

                {/* Message Composer */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    onHandleMessageSubmit(e, user, receptorUser)
                    e.currentTarget.reset()
                  }}
                  method="POST"
                  aria-label="Enviar mensaje"
                  className="p-3.5 border-t border-white/[0.08] bg-[#141418] flex items-center gap-2.5"
                >
                  <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder={`Message ${receptorUser.username}...`}
                    required
                    className="flex-1 h-10 px-4 rounded-xl bg-[#09090b] border border-white/10 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="submit"
                    role="grid"
                    className="h-10 px-4 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
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
                <p className="text-sm font-medium text-zinc-200">
                  Your Messages
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Select a user from the contacts bar above to start chatting
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
