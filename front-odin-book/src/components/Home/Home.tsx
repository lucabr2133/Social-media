import React, { useContext, useState } from 'react'
import { UserContext, UserSession } from '../../contex/context.js'
import MainHeader from '../Header/Header.tsx'
import styles from './Home.module.css'
import CreatePublication from '../CreatePublication/CreatePublication.tsx'
import FollowingList from './FollowingList.tsx'
import { useFollow } from '../../contex/FollowContext.tsx'
import { usePublicationContext } from '../../contex/PublicationContext.tsx'
import PublicationsHome from './PublicationsHome.tsx'
import usePublication from '../../hooks/getPublications.js'
import { useFollowing } from '../../hooks/useFollowing.js'

function Home() {
  const userContex = useContext(UserSession)
  const users = useContext(UserContext)
  const [opendialog, setOpenDialog2s] = useState(false)

  // Initialize data loaders
  const { loading: loadingPublications } = usePublication()
  const { loading: loadingFollowing } = useFollowing()

  const { state: followState } = useFollow()
  const { state: publicationState } = usePublicationContext()

  if (!userContex) throw new Error('the user should exist')
  const { user } = userContex

  if (!user || !users) {
    return (
      <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white animate-spin" />
        <span className="text-xs font-medium text-zinc-400 tracking-wide">
          Loading feed...
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex">
        <MainHeader setOpenDialog2s={setOpenDialog2s} userActive={user} />

        <div className="flex-1 w-full lg:pl-[max(15%,220px)] pb-20 lg:pb-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 lg:pt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
            <main className="w-full min-w-0">
              <PublicationsHome
                styles={styles}
                following={followState?.following || []}
                publications={publicationState?.publications || []}
                user={user}
                users={users}
                isLoading={loadingPublications || loadingFollowing}
              />
            </main>

            <aside className="hidden lg:block sticky top-8">
              <FollowingList user={user} users={users} />
            </aside>
          </div>
        </div>
      </div>

      <CreatePublication
        opendialog={opendialog}
        setOpenDialog={setOpenDialog2s}
        userActive={user}
      />
    </>
  )
}

export default Home
