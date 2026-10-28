import React, { useContext, useEffect, useState } from 'react'
import { Params, useParams } from 'react-router'
import CreatePublication from '../CreatePublication/CreatePublication.js'
import updatePublication from '../../../services/onHandleSubmitUpdatePublication.js'
import styles from './Profile.module.css'
import { UserContext, UserSession } from '../../contex/context.js'
import useUser from '../../hooks/useUser'
import usePublication from '../../hooks/getUserPublicattion.js'
import Header from './Header.js'
import UpdatePublicationProfile from './UpdatePublicationProfile.tsx'
import PublicationGrid from './PublicationGrid'
import MainHeader from '../Header/Header.js'
import { Publications, User } from '../../types.js'
import { useFollow } from '../../contex/FollowContext.js'
import { usePublicationContext } from '../../contex/PublicationContext.js'

function Profile() {
  const [openDialgo2, setOpenDialog2s] = useState(false)
  const { username } = useParams<Params>()
  const userContext = useContext(UserSession)
  const users = useContext(UserContext)
  const [updateForm, setUpdateForm] = useState<string | null>(null)
  const { state: followingState } = useFollow()

  if (!userContext) throw new Error('you need a valid provider')
  const { user: userSession } = userContext
  const [userData, setUserData] = useState<User | null>(null)
  const { user } = useUser(username)

  useEffect(() => {
    if (user) {
      setUserData(user)
    }
  }, [user])

  const userId = user?.id
  const { publications, setPublication } = usePublication(userId)
  const { state, deleteAction } = usePublicationContext()

  const isLoading = ![
    followingState,
    state,
    users,
    userData,
    userSession,
    publications,
  ].every(Boolean)

  if (
    isLoading ||
    !publications ||
    !userData ||
    !followingState ||
    !username ||
    !users ||
    !userSession
  ) {
    return (
      <div className="min-h-screen w-full bg-[#09090b] flex flex-col items-center justify-center gap-3">
        <div className="w-7 h-7 rounded-full border-2 border-white/15 border-t-white animate-spin" />
        <span className="text-xs font-medium text-zinc-400 tracking-wide">
          Loading profile...
        </span>
      </div>
    )
  }

  function sortByDateDesc(items: Publications[]) {
    return [...items].sort(
      (a, b) =>
        new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
    )
  }

  const sortedVideos = sortByDateDesc(publications)

  return (
    <>
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex">
        <MainHeader userActive={userSession} setOpenDialog2s={setOpenDialog2s} />

        <div className="flex-1 w-full lg:pl-[max(15%,220px)] pb-20 lg:pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 lg:pt-8">
            <Header
              data={{
                userData,
                userSession,
                publications,
                following: followingState.following,
              }}
              actions={{ setUserData }}
              usernameParam={username}
              styles={styles}
              allUsers={users}
            />

            <div className={styles['my-publications']}>
              <PublicationGrid
                extra={{
                  deleteAction,
                  userSession,
                  userData,
                  users,
                  setUpdateForm,
                  setPublications: setPublication,
                }}
                styles={styles}
                data={{ sortedVideos, publications }}
              />
            </div>
          </div>
        </div>
      </div>

      <UpdatePublicationProfile
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        setPublication={setPublication}
        updatePublication={updatePublication}
      />

      <CreatePublication
        opendialog={openDialgo2}
        setOpenDialog={setOpenDialog2s}
        userActive={userSession}
      />
    </>
  )
}

export default Profile
