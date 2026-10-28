import PublicationList from './PublicationList'
import React, { useState } from 'react'
import { Publications, User } from '../../types'
import { LayoutGrid, List, Heart, MessageCircle } from 'lucide-react'

interface props {
  styles: Record<string, string>
  extra: {
    users: User[]
    deleteAction: (publicationId: string) => void
    setUpdateForm: React.Dispatch<React.SetStateAction<string | null>>
    setPublications: React.Dispatch<React.SetStateAction<Publications[] | null>>
    userData: User
    userSession: User
  }
  data: {
    publications: Publications[]
    sortedVideos: Publications[]
  }
}

function PublicationGrid({ styles, data, extra }: props) {
  const {
    users,
    deleteAction,
    setUpdateForm,
    setPublications,
    userData,
    userSession,
  } = extra
  const { publications, sortedVideos } = data
  const [openedId, setOpenedId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards')
  const [selectedGridItem, setSelectedGridItem] = useState<Publications | null>(null)

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      {/* View Switcher Header */}
      {publications && sortedVideos.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Posts ({sortedVideos.length})
          </span>

          <div className="flex items-center p-1 bg-[#121215] border border-white/[0.08] rounded-xl">
            <button
              type="button"
              title="Feed view"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              title="Grid view"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Publications Content */}
      {publications && sortedVideos.length > 0 ? (
        viewMode === 'cards' ? (
          <div className="flex flex-col gap-6">
            {sortedVideos.map((publication) => (
              <PublicationList
                key={publication.id}
                styles={styles}
                actions={{
                  setOpenedId,
                  setUpdateForm,
                  deleteAction,
                  setPublications,
                }}
                data={{
                  openedId,
                  users,
                  publication,
                  userData,
                  publications,
                  userSession,
                }}
              />
            ))}
          </div>
        ) : (
          /* 3-column photo grid */
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {sortedVideos.map((publication) => (
              <div
                key={publication.id}
                onClick={() => setSelectedGridItem(publication)}
                className="group relative aspect-square bg-[#121215] rounded-xl overflow-hidden border border-white/[0.06] cursor-pointer"
              >
                <img
                  src={publication.image_url}
                  alt={publication.content || 'Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <p className="text-[11px] text-white px-2 text-center line-clamp-2 font-medium">
                    {publication.content || 'View post'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-sm font-medium text-zinc-300">No posts yet</p>
          <p className="text-xs text-zinc-500 mt-1">
            When {userData.username} shares photos, they will appear here.
          </p>
        </div>
      )}

      {/* Grid Click Lightbox / Detail Modal */}
      {selectedGridItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedGridItem(null)}
        >
          <div
            className="w-full max-w-lg bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedGridItem.image_url}
              alt=""
              className="w-full max-h-[60vh] object-contain bg-[#09090b]"
            />
            <div className="p-4">
              <p className="text-sm text-zinc-200">{selectedGridItem.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicationGrid
