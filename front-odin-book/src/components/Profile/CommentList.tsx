import onHandleSubmitComment from '../../../services/onHandleSubmitComment'
import useComments from '../../hooks/getComments'
import React, { useEffect } from 'react'
import { Comments, Publications, User } from '../../types'
import { socket } from '../../socket'
import { CommentSkeleton } from './CommentSkeleton'
import { Send } from 'lucide-react'

interface props {
  styles: Record<string, string>
  publication: Publications
  users: User[]
  user: User
}

function CommentList({ publication, user }: props) {
  const {
    comments: commentsHook,
    setComments,
    loading,
  } = useComments(publication.id)

  useEffect(() => {
    if (!publication?.id) return

    socket.emit('publicationRomm', publication.id)

    const handleComment = (comment: Comments) => {
      setComments((prev) => [...prev, comment])
    }

    socket.on('publication comments', handleComment)

    return () => {
      socket.off('publication comments', handleComment)
    }
  }, [publication.id, setComments])

  if (loading) {
    return (
      <div className="py-2 w-full">
        <CommentSkeleton />
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col gap-3"
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {/* Comments List */}
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
        {commentsHook && commentsHook.length > 0 ? (
          commentsHook.map((comment) => (
            <div
              key={comment.id}
              className="flex items-start gap-2.5 text-xs bg-white/[0.02] border border-white/[0.05] rounded-xl p-3"
            >
              <img
                width={28}
                height={28}
                className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                src={comment.author?.profileImg || '/profile2.svg'}
                alt={comment.author?.username || 'User'}
              />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-white block">
                  {comment.author?.username}
                </span>
                <p className="text-zinc-300 mt-0.5 break-words leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-zinc-500 py-3 text-center">
            No comments yet. Start the conversation!
          </p>
        )}
      </div>

      {/* Add Comment Form */}
      <form
        className="w-full flex items-center gap-2 pt-1"
        onSubmit={(e) => {
          onHandleSubmitComment(e, user.id, publication.id)
        }}
      >
        <input
          className="flex-1 h-9 px-3.5 rounded-xl bg-[#09090b] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
          type="text"
          name="comment"
          placeholder="Add a comment..."
        />
        <button
          className="h-9 px-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          type="submit"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>
    </div>
  )
}

export default CommentList
