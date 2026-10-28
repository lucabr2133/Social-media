import onHandleSubmitComment from '../../../services/onHandleSubmitComment'
import useComments from '../../hooks/getComments'
import React, { useEffect, useState } from 'react'
import { Comments, Publications, User } from '../../types'
import { socket } from '../../socket'
import { CommentSkeleton } from './CommentSkeleton'
import { Send, Trash2 } from 'lucide-react'
import { timeAgo } from '../../utils/timeAgo'
import { Link } from 'react-router'

interface props {
  styles: Record<string, string>
  publication: Publications
  users: User[]
  user: User
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function CommentList({ publication, user }: props) {
  const {
    comments: commentsHook,
    setComments,
    loading,
  } = useComments(publication.id)
  const [commentText, setCommentText] = useState('')

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

  const handleDeleteComment = async (commentId: string) => {
    try {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      await fetch(`${apiUrl}/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
    } catch (e) {
      console.error('Error deleting comment:', e)
    }
  }

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
      <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
        {commentsHook && commentsHook.length > 0 ? (
          commentsHook.map((comment) => {
            const isMyComment =
              comment.user_id === user.id ||
              comment.author?.username === user.username

            return (
              <div
                key={comment.id}
                className="group flex items-start justify-between gap-3 text-xs bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-xl p-3 transition-colors"
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <Link
                    to={`/profile/${comment.author?.username}`}
                    className="shrink-0 mt-0.5"
                  >
                    <img
                      width={28}
                      height={28}
                      className="w-7 h-7 rounded-full object-cover border border-white/10"
                      src={comment.author?.profileImg || '/profile2.svg'}
                      alt={comment.author?.username || 'User'}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <Link
                        to={`/profile/${comment.author?.username}`}
                        className="font-semibold text-white hover:underline truncate"
                      >
                        {comment.author?.username}
                      </Link>
                      <span className="text-[10px] text-zinc-500">
                        {timeAgo(comment.create_at)}
                      </span>
                    </div>
                    <p className="text-zinc-300 mt-1 break-words leading-relaxed text-[12px]">
                      {comment.content}
                    </p>
                  </div>
                </div>

                {isMyComment && (
                  <button
                    type="button"
                    title="Delete comment"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          })
        ) : (
          <p className="text-xs text-zinc-500 py-4 text-center">
            No comments yet. Start the conversation!
          </p>
        )}
      </div>

      {/* Add Comment Form */}
      <form
        className="w-full flex items-center gap-2 pt-1"
        onSubmit={async (e) => {
          e.preventDefault()
          if (!commentText.trim()) return
          await onHandleSubmitComment(e, user.id, publication.id)
          setCommentText('')
        }}
      >
        <input
          className="flex-1 h-9 px-3.5 rounded-xl bg-[#09090b] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
          type="text"
          name="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          className="h-9 px-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          type="submit"
          disabled={!commentText.trim()}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>
    </div>
  )
}

export default CommentList
