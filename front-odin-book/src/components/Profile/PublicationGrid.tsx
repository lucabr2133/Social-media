import PublicationList from './PublicationList'
import React, { useState } from 'react'
import { Publications, User } from '../../types'

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

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {publications && sortedVideos.length > 0 ? (
        sortedVideos.map((publication) => (
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
        ))
      ) : (
        <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-12 text-center">
          <p className="text-sm font-medium text-zinc-300">No posts yet</p>
          <p className="text-xs text-zinc-500 mt-1">
            When {userData.username} shares photos, they will appear here.
          </p>
        </div>
      )}
    </div>
  )
}

export default PublicationGrid
