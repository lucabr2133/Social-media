import React, { useState, lazy, Suspense } from 'react'
import { Following, Publications, User } from '../../types'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import { Link } from 'react-router'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import {
  Heart,
  MessageCircle,
  X,
  Bookmark,
  Share2,
  Maximize2,
  Search,
  Sparkles,
  Users as UsersIcon,
  BookmarkCheck,
} from 'lucide-react'
import { SpinnerComponnet } from '../ui/spinner'
import { timeAgo } from '../../utils/timeAgo'
import {
  isPostBookmarked,
  togglePostBookmark,
  getBookmarkedIds,
} from '../../utils/bookmarks'
import toast, { Toaster } from 'react-hot-toast'

const PublicationOpen = lazy(() => import('./PublicationOpen'))

interface props {
  styles: Record<string, string>
  user: User
  users: User[]
  publications: Publications[]
  following: Following[]
  isLoading?: boolean
}

type TabType = 'for-you' | 'following' | 'saved'

export default function PublicationsHome({
  styles,
  user,
  users,
  publications,
  following,
  isLoading,
}: props) {
  const [open, setOpen] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('for-you')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [animatingLikeId, setAnimatingLikeId] = useState<string | null>(null)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() =>
    getBookmarkedIds(user.id)
  )

  const { addLike, deleteLike, state } = usePublicationLikes()

  // Handle like toggle
  const handleLikeToggle = async (
    e: React.MouseEvent<HTMLElement>,
    pubId: string
  ) => {
    e.stopPropagation()
    const checked = state.likes.filter(
      (like) => like.post_id === pubId && like.user_id === user.id
    )
    if (checked.length > 0) {
      deleteLike(checked[0])
      await onHandleDeletedLike(checked[0].id)
    } else {
      const like = await onHandleLikePublication(e as any, pubId, user.id)
      addLike(like)
      setAnimatingLikeId(pubId)
      setTimeout(() => setAnimatingLikeId(null), 800)
    }
  }

  // Double click photo to like
  const handleDoubleClickPhoto = async (
    e: React.MouseEvent<HTMLElement>,
    pubId: string
  ) => {
    const isLiked = state.likes.some(
      (like) => like.post_id === pubId && like.user_id === user.id
    )
    if (!isLiked) {
      await handleLikeToggle(e, pubId)
    } else {
      setAnimatingLikeId(pubId)
      setTimeout(() => setAnimatingLikeId(null), 800)
    }
  }

  // Handle bookmark toggle
  const handleBookmarkToggle = (pubId: string) => {
    const isNowBookmarked = togglePostBookmark(user.id, pubId)
    setBookmarkedIds(getBookmarkedIds(user.id))
    toast.success(
      isNowBookmarked ? 'Post saved to bookmarks' : 'Post removed from bookmarks',
      {
        style: {
          background: '#18181b',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fafafa',
          fontSize: '12px',
          borderRadius: '12px',
        },
      }
    )
  }

  // Handle share link
  const handleShare = (publication: Publications) => {
    const url = `${window.location.origin}/profile/${publication.author?.username}`
    navigator.clipboard.writeText(url)
    toast.success('Profile link copied to clipboard', {
      style: {
        background: '#18181b',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fafafa',
        fontSize: '12px',
        borderRadius: '12px',
      },
    })
  }

  // Filter publications based on active tab and search query
  const filteredPublications = publications.filter((publication) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchContent = publication.content?.toLowerCase().includes(q)
      const matchAuthor = publication.author?.username?.toLowerCase().includes(q)
      if (!matchContent && !matchAuthor) return false
    }

    if (activeTab === 'following') {
      const isFollowed = following.some(
        (f) =>
          f.follower_id === publication.user_id && f.following_id === user.id
      )
      const isOwn = publication.user_id === user.id
      return isFollowed || isOwn
    }

    if (activeTab === 'saved') {
      return bookmarkedIds.includes(publication.id)
    }

    return true
  })

  return (
    <>
      <Toaster position="bottom-right" />

      <div className="flex flex-col gap-5 w-full max-w-xl mx-auto">
        {/* Feed Header with Tabs & Search */}
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Home Feed
              </h1>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Discover moments and conversations from the community
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#09090b] border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#09090b] rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveTab('for-you')}
              className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'for-you'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>For You</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('following')}
              className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'following'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UsersIcon className="w-3.5 h-3.5" />
              <span>Following</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`flex-1 h-8 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({bookmarkedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <SpinnerComponnet />
          </div>
        )}

        {/* Empty States */}
        {!isLoading && filteredPublications.length === 0 ? (
          <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-12 text-center">
            {activeTab === 'saved' ? (
              <>
                <Bookmark className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-300">
                  No saved posts yet
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Click the bookmark icon on any post to save it for later.
                </p>
              </>
            ) : activeTab === 'following' ? (
              <>
                <UsersIcon className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-zinc-300">
                  No posts from people you follow
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Find new creators in the Discover tab to populate your following feed.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-zinc-300">
                  No posts found
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {searchQuery
                    ? `No posts matching "${searchQuery}".`
                    : 'Be the first to create a post and start the conversation!'}
                </p>
              </>
            )}
          </div>
        ) : (
          filteredPublications.map((publication) => {
            const isLikedByMe = state.likes.some(
              (l) => l.post_id === publication.id && l.user_id === user.id
            )
            const likeCount = state.likes.filter(
              (n) => n.post_id === publication.id
            ).length
            const isCommentsOpen = open === publication.id
            const isSaved = bookmarkedIds.includes(publication.id)
            const isHeartAnimating = animatingLikeId === publication.id

            return (
              <article
                key={publication.id}
                aria-label={`publication ${publication.author?.username}`}
                className="bg-[#121215] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-colors shadow-sm"
              >
                {/* Author Row */}
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
                      <span className="text-[11px] text-zinc-500">
                        {timeAgo(publication.create_at)}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Share link"
                      onClick={() => handleShare(publication)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title={isSaved ? 'Remove bookmark' : 'Save post'}
                      onClick={() => handleBookmarkToggle(publication.id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Post Image with Double Click Like & Zoom */}
                {publication.image_url && (
                  <div
                    className="relative w-full bg-[#09090b] border-y border-white/[0.06] max-h-[560px] overflow-hidden flex items-center justify-center cursor-pointer select-none group/img"
                    onDoubleClick={(e) =>
                      handleDoubleClickPhoto(e, publication.id)
                    }
                  >
                    <img
                      src={publication.image_url}
                      alt={publication.content || 'Post image'}
                      className="w-full h-auto max-h-[560px] object-cover block"
                    />

                    {/* Quick Lightbox Zoom Button */}
                    <button
                      type="button"
                      title="View full image"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLightboxImage(publication.image_url)
                      }}
                      className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/80 hover:text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>

                    {/* Double-click Heart Pop Animation */}
                    {isHeartAnimating && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                        <Heart className="w-20 h-20 fill-rose-500 text-rose-500 drop-shadow-2xl" />
                      </div>
                    )}
                  </div>
                )}

                {/* Post Actions & Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        aria-label="like"
                        onClick={(e) => handleLikeToggle(e, publication.id)}
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

                    <button
                      type="button"
                      onClick={() => handleBookmarkToggle(publication.id)}
                      className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isSaved ? 'fill-emerald-400 text-emerald-400' : ''
                        }`}
                      />
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

                  {/* Inline expandable comments */}
                  {isCommentsOpen && (
                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-zinc-400">
                          Comments & Discussion
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

      {/* Fullscreen Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen view"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
