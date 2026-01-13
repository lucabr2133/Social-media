import React, { useContext, lazy, Suspense } from 'react'
import usePublication from '../../hooks/getPublications'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import styles from './Home.module.css'
import { UserContext, UserSession } from '../../contex/context'
import MainHeader from '../Header/Header'
import { Link } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ArrowRightCircle } from 'lucide-react'
import { toggleFollow } from '../../../services/onHandleToggleFollow'
import { UsemyActions } from '../../Reducers/UserReducer'
import { useFollowing } from '../../hooks/useFollowing'
import { ErrorMessage } from '../ui/Error'

function Home () {
  const PublicationHome = lazy(() => import('./PublicationsHome'))
  const contex = useContext(UserSession)
  const { followAction, unfollowAction, isFollowing } = UsemyActions()

  if (!contex) throw new Error('The context must have a valid provider')
  const { user } = contex
  const { publication } = usePublication()
  const users = useContext(UserContext)
  const { state, error, loading } = useFollowing()

  if (loading || !users || !user) {
    return (
      <div className='min-h-screen flex items-center justify-center flex-col gap-5'>
        <h2>Loading...</h2>
        <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
      />
    )
  }

  return (
    <>
      <div className='lg:grid  lg:grid-cols-[15%_65%_20%] block'>
        <MainHeader userActive={user} />
        <main className='w-full'>
          <div className={styles['publications-home']}>
            <Suspense fallback={
              <div className='min-h-screen flex items-center justify-center flex-col gap-5'>
                <h2>Loading...</h2>
                <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />

              </div>
}
            >
              {publication?.map((publication) => {
                return (

                  <PublicationHome data={{ user, users, publication }} styles={styles} actions={{ onHandleDeletedLike, onHandleLikePublication }} key={publication.id} />
                )
              })}
            </Suspense>

          </div>
        </main>
        <aside style={{
          display: 'flex',
          flexDirection: 'column'
        }}
        >
          <div
            style={{
              margin: '15px'

            }} className='hidden  lg:flex flex-col gap-4  rounded-2xl  border-neutral-700 '
          >

            {users.map((userl) => (
              <div
                key={userl.id}
                className='
        group
        flex items-center justify-between
        p-3
        rounded-2xl
        bg-neutral-900/60
        border border-transparent
        hover:border-amber-600/50
        hover:bg-neutral-800/70
        transition-all duration-300
        hover:scale-105
      '
              >
                <div className='flex items-center gap-3'>
                  <Link
                    to={`/profile/${userl.username}`}
                    className='rounded-full hover:bg-transparent!'
                  >
                    <Avatar className='size-10 ring-2 ring-neutral-700 group-hover:ring-amber-500  transition'>
                      <AvatarImage src={userl.profileImg || '/profile2.svg'} />
                      <AvatarFallback />
                    </Avatar>
                  </Link>

                  <h2 className='text-sm font-semibold capitalize text-neutral-100'>
                    {userl.username}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    toggleFollow(userl, user, state, unfollowAction, followAction)
                  }}
                  className={`
          h-8 px-4
          text-xs font-semibold capitalize
          rounded-full
         ${isFollowing(userl.id, user.id) ? 'bg-red-600!' : 'bg-blue-600!'}
          text-white
          hover:from-blue-600 hover:to-blue-700
          shadow-md
          transition-all duration-300
        `}
                >
                  {isFollowing(userl.id, user.id) ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))}

            <h2
              className='
                      mt-2
                      py-2
                      rounded-2xl
                      flex items-center justify-center gap-2
                      text-sm font-semibold
                      text-neutral-300
                      hover:text-white
                      hover:bg-neutral-700/50
                      cursor-pointer
                      transition-all duration-300
                    '
            >
              See more <ArrowRightCircle size={16} />
            </h2>
          </div>

        </aside>
      </div>

    </>
  )
}
export default Home
