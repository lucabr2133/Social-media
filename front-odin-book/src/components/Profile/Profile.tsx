import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Params, useParams } from 'react-router'
import CreatePublication from '../CreatePublication/CreatePublication.js'
import updatePublication from '../../../services/onHandleSubmitUpdatePublication.js'
import styles from './Profile.module.css'
import {useFollowing} from '../../hooks/useFollowing.js'
import { PublicationContext, UserContext, UserSession } from '../../contex/context.js'
import useUser from '../../hooks/useUser'
import usePublication from '../../hooks/getUserPublicattion.js'
import Header from './Header.js'
import UpdatePublicationProfile from './UpdatePublicationProfile.jsx'
import PublicationGrid from './PublicationGrid'
import MainHeader from '../Header/Header.js'
import {  Publications, User } from '../../types.js'
import { useFollow } from '../../contex/FollowContext.js'
function Profile() {
  const [openDialgo2, setOpenDialog2s] = useState(false)
const {username}=useParams<Params>()
  const context = useContext(PublicationContext)
  const userContext= useContext(UserSession)

  if(!context ||!userContext )throw new Error('you have to put the correctly provider')
  const users = useContext(UserContext)
  const [updateForm, setUpdateForm] = useState<string|null>(null)
  const { state:followingState } = useFollow()

  const { user: userSession } = userContext
  const [userData, setUserData] = useState<User|null>(null)
  const { user } = useUser(username)
  useEffect(() => {
    if (user) {
      setUserData(user)
    }
  }, [user])
  const userId=user?.id
  const { publications } = usePublication(userId)
  const { state, dispatch } = context;

useEffect(() => {
  if (!publications) return
  if (publications.length === 0) return // no dispatch con array vacío
  dispatch({ type: "set", publications })
}, [publications, dispatch])
  const isLoading = ![followingState, state, users, userData, userSession, publications].every(Boolean)

  if (isLoading||!publications||!userData||!followingState||!username||!users||!userSession) {
    return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-5">
    <h2>Loading...</h2>
    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
    )
  }
 
  
  function sortByDateDesc(publications:Publications[]) {
    return [...publications].sort((a, b) => new Date(b.create_at).getDate() - new Date(a.create_at).getDate())
  }
  
  const sortedVideos = sortByDateDesc(state.publications)

  return (
    <>
      <div className={` lg:grid lg:grid-cols-[15%] min-h-screen flex flex-col  `}>
        <MainHeader userActive={userSession} setOpenDialog2s={setOpenDialog2s} />
        <div className={styles.mainpublication}>
          <Header
            data={{ userData, userSession, publications,following:followingState.following }}
            actions={{ setUserData }}
            usernameParam={username}
            styles={styles}
          />
          <div className={styles['my-publications']}>
            <PublicationGrid extra={{ userSession, userData, dispatch, users, setUpdateForm }} styles={styles} data={{ sortedVideos, publications }} />
          </div>

        </div>

      </div>

      <UpdatePublicationProfile updateForm={updateForm} setUpdateForm={setUpdateForm} dispatch={dispatch} styles={styles} updatePublication={updatePublication} />

      <CreatePublication opendialog={openDialgo2} setOpenDialog={setOpenDialog2s} userActive={userSession} />
    </>
  )
}
export default Profile
