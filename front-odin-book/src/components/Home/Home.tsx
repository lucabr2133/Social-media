import React, { useContext } from 'react'
import usePublication from '../../hooks/getPublications'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import styles from './Home.module.css'
import { UserContext, UserSession } from '../../contex/context'
import MainHeader from '../Header/Header'
import { ArrowRightCircle } from 'lucide-react'
import { useFollowing } from '../../hooks/useFollowing'
import { ErrorMessage } from '../ui/Error'
import FollowingList from './FollowingList'
import GlobalLoading from '../../GlobalLoading'
import PublicationHome from './PublicationsHome'
import PublicationSkeleton from './PublicationSkeleton'
import { useFollow } from '../../contex/FollowContext'
import { usePublicationContext } from '../../contex/PublicationContext'
import { Link } from 'react-router'
function Home () {
  const contex = useContext(UserSession)
  const users = useContext(UserContext)

  if (!contex) throw new Error('The context must have a valid provider')

  const { user } = contex

  const { error: errorPublication, loading: loadingPublication } = usePublication()
  const { error: errorFollowing, loading: loadingFollowing } = useFollowing()
  // global following state used in the follower suggestions
  const { state } = useFollow()
  const { state: publication } = usePublicationContext()
  if (errorPublication || errorFollowing) {
    return (
      <ErrorMessage
        message={errorPublication || errorFollowing}
      />
    )
  }
  if (!user || !users) {
    return <GlobalLoading />
  }

  return (
    <>
      <div className='lg:grid  lg:grid-cols-[15%_65%_20%] block'>
        <MainHeader userActive={user} />
        <main className='w-full'>
          <div className={styles['publications-home']}>
            {loadingPublication
              ? <PublicationSkeleton />
              : publication.publications?.map((publication) => {
                return (

                  <PublicationHome data={{ user, users, publication }} styles={styles} actions={{ onHandleDeletedLike, onHandleLikePublication }} key={publication.id} />
                )
              })}

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

            <FollowingList state={state} user={user} users={users} />

            <Link to={'/users'}
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
            </Link>
          </div>

        </aside>
      </div>

    </>
  )
}
export default Home
