import React, { useState } from 'react'
import CommentList from './CommentList'
import { Publications, User } from '../../types'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import { X, Heart, MessageCircle, Pencil, Trash2 } from 'lucide-react'

interface Props {
  styles: Record<string, string>
  data: {
    users: User[]
    publication: Publications
    publications: Publications[]
    userData: User
    userSession: User
    openedId: string | null
  }
  actions: {
    deleteAction: (publicationId: string) => void
    setUpdateForm: React.Dispatch<React.SetStateAction<string | null>>
    setOpenedId: React.Dispatch<React.SetStateAction<string | null>>
    setPublications: React.Dispatch<React.SetStateAction<Publications[] | null>>
  }
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function PublicationList({ styles, data, actions }: Props) {
  const { users, publication, userSession, userData, publications } = data
  const { setUpdateForm, setPublications } = actions
  const [isOpen, setOpenId] = useState<null | string>(null)
  const isOwner = userSession?.id === userData?.id
  const { addLike, deleteLike, state } = usePublicationLikes()

  async function deletePublication(publicationId: string) {
    try {
      await fetch(`${apiUrl}/publications/publications/${publicationId}`, {
        method: 'delete',
        credentials: 'include',
      })
      const newPublications = publications.filter(
        (item) => item.id !== publicationId
      )
      setPublications(newPublications)
    } catch (error) {
      console.error('Error deleting publication:', error)
    }
  }

  async function onHandleClickLike(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    const checked = state.likes.filter(
      (like) =>
        like.post_id === publication.id && like.user_id === userSession.id
    )
    if (checked.length > 0) {
      deleteLike(checked[0])
      onHandleDeletedLike(checked[0].id)
    } else {
      const like = await onHandleLikePublication(
        e as any,
        publication.id,
        userSession.id
      )
      addLike(like)
    }
  }

  const isLikedByMe = state.likes.some(
    (l) => l.post_id === publication.id && l.user_id === userSession.id
  )
  const likeCount = state.likes.filter(
    (n) => n.post_id === publication.id
  ).length

  return (
    <article className="bg-[#121215] border border-white/[0.08] hover:border-white/[0.14] rounded-2xl overflow-hidden transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <img
            src={userData?.profileImg || '/profile2.svg'}
            alt={userData?.username || 'user'}
            className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
          />
          <span className="text-sm font-semibold text-white">
            {userData?.username}
          </span>
        </div>

        {isOwner && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setUpdateForm(publication.id)}
              className="h-8 px-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-xs font-medium text-zinc-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => deletePublication(publication.id)}
              className="h-8 px-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-300 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      {publication?.image_url && (
        <div className="w-full bg-[#09090b] border-y border-white/[0.06] max-h-[560px] overflow-hidden flex items-center justify-center">
          <img
            src={publication.image_url}
            alt="publication"
            className="w-full h-auto max-h-[560px] object-cover block"
          />
        </div>
      )}

      {/* Actions & Caption */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-3">
          <button
            type="button"
            onClick={onHandleClickLike}
            aria-label="like"
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
            onClick={() => setOpenId(isOpen ? null : publication.id)}
            aria-label="comment"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Comments</span>
          </button>
        </div>

        {publication.content && (
          <p className="text-sm text-zinc-200 leading-relaxed">
            <span className="font-semibold text-white mr-2">
              {userData?.username}
            </span>
            {publication.content}
          </p>
        )}

        {/* Inline Comments Drawer */}
        {isOpen && (
          <div className="mt-4 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400">
                Comments
              </span>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <CommentList
              publication={publication}
              styles={styles}
              user={userSession}
              users={users}
            />
          </div>
        )}
      </div>
    </article>
  )
}

export default PublicationList
