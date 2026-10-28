import React, { useState, lazy, Suspense } from 'react'
import { Following, Publications, User } from '../../types'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import { Link } from 'react-router'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import { Heart, MessageCircle, X } from 'lucide-react'
import { SpinnerComponnet } from '../ui/spinner'

const PublicationOpen = lazy(() => import('./PublicationOpen'))

interface props {
  styles: Record<string, string>
  user: User
  users: User[]
  publications: Publications[]
  following: Following[]
}

export default function PublicationsHome({
  styles,
  user,
  users,
  publications,
  following,
}: props) {
  const [open, setOpen] = useState('')
  const { addLike, deleteLike, state } = usePublicationLikes()

  const feedPublications = publications.filter((publication) => {
    const isLiked = state.likes.some((l) => l.post_id === publication.id)
    const isFollow = following.some(
      (f) => f.follower_id === publication.user_id && f.following_id === user.id
    )
    const isOwn = publication.user_id === user.id
    return isLiked || isFollow || isOwn || true
  })

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Home Feed
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Latest posts from people across Odin Book
          </p>
        </div>
      </div>

      {feedPublications.length === 0 ? (
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-sm font-medium text-zinc-300">No posts yet</p>
          <p className="text-xs text-zinc-500 mt-1">
            Follow other users or share your first post to see activity here.
          </p>
        </div>
      ) : (
        feedPublications.map((publication) => {
          const isLikedByMe = state.likes.some(
            (l) => l.post_id === publication.id && l.user_id === user.id
          )
          const likeCount = state.likes.filter(
            (n) => n.post_id === publication.id
          ).length
          const isCommentsOpen = open === publication.id

          return (
            <article
              key={publication.id}
              aria-label={`publication ${publication.author?.username}`}
              className="bg-[#121215] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-colors shadow-sm"
            >
              {/* Author Header */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <Link
                  to={`/profile/${publication.author?.username}`}
                  className="flex items-center gap-3 group"
                >
                  <img
                    width={38}
                    height={38}
                    src={publication.author?.profileImg || '/profile2.svg'}
                    alt={publication.author?.username || 'Author'}
                    className="w-9 h-9 rounded-full object-cover border border-white/10 group-hover:border-white/30 transition-colors"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white group-hover:underline">
                      {publication.author?.username}
                    </span>
                    {publication.create_at && (
                      <span className="text-[11px] text-zinc-500">
                        {new Date(publication.create_at).toLocaleDateString(
                          undefined,
                          {
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Post Image */}
              {publication.image_url && (
                <div className="w-full bg-[#09090b] border-y border-white/[0.06] max-h-[560px] overflow-hidden flex items-center justify-center">
                  <img
                    src={publication.image_url}
                    alt={publication.content || 'Post image'}
                    className="w-full h-auto max-h-[560px] object-cover block"
                  />
                </div>
              )}

              {/* Post Actions & Content */}
              <div className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <button
                    type="button"
                    aria-label="like"
                    onClick={async (e) => {
                      const checked = state.likes.filter(
                        (like) =>
                          like.post_id === publication.id &&
                          like.user_id === user.id
                      )
                      if (checked.length > 0) {
                        deleteLike(checked[0])
                        onHandleDeletedLike(checked[0].id)
                      } else {
                        const like = await onHandleLikePublication(
                          e as any,
                          publication.id,
                          user.id
                        )
                        addLike(like)
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer group"
                  >
                    <Heart
                      className={`w-5 h-5 transition-transform group-active:scale-125 ${
                        isLikedByMe
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-zinc-400 group-hover:text-white'
                      }`}
                    />
                    <span className="tabular-nums">{likeCount}</span>
                  </button>

                  <button
                    type="button"
                    aria-label="comment"
                    onClick={() =>
                      setOpen(isCommentsOpen ? '' : publication.id)
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Comments</span>
                  </button>
                </div>

                {/* Caption */}
                {publication.content && (
                  <p className="text-sm text-zinc-200 leading-relaxed">
                    <Link
                      to={`/profile/${publication.author?.username}`}
                      className="font-semibold text-white hover:underline mr-2"
                    >
                      {publication.author?.username}
                    </Link>
                    {publication.content}
                  </p>
                )}

                {/* Inline expandable comments section */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-4 border-t border-white/[0.08]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-zinc-400">
                        Discussion
                      </span>
                      <button
                        type="button"
                        onClick={() => setOpen('')}
                        className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <Suspense
                      fallback={
                        <div className="py-6 flex justify-center">
                          <SpinnerComponnet />
                        </div>
                      }
                    >
                      <PublicationOpen
                        publication={publication}
                        setOpen={setOpen}
                        styles={styles}
                        user={user}
                        users={users}
                      />
                    </Suspense>
                  </div>
                )}
              </div>
            </article>
          )
        })
      )}
    </div>
  )
}
