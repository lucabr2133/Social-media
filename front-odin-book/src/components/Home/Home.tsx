import React, { useState, useContext, useReducer, useEffect ,lazy,Suspense} from 'react'
import usePublication from '../../hooks/getPublications'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import useLikesPublication from '../../hooks/useLikes'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import CreatePublication from '../CreatePublication/CreatePublication'
import styles from './Home.module.css'
import { PublicationContext, UserContext, UserSession } from '../../contex/context'
import MainHeader from '../Header/Header'
import { Likes } from '../../types'
import VerticalHeader from '../Header/VericalHeader'
import { Link } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

function Home () {
  const PublicationHome = lazy(() => import('./PublicationsHome'));
  const [opendialog, setOpenDialog] = useState(false)
const contex= useContext(UserSession)
const contexPublication=useContext(PublicationContext)

if(!contex|| !contexPublication) throw new Error('The context must have a valid provider')
  const { user } =contex
const{dispatch,state}=contexPublication
 const {publication}=usePublication()
  const users = useContext(UserContext)
  const { publicationLikes } = useLikesPublication()
  useEffect(()=>{
      if(!publication)return
      if(publication.length==0)return
      dispatch({type:'set',publications:publication})
  },[publication])
  const isLoading = ![ users, user, publicationLikes].every(Boolean)

  if (isLoading ||!users ||!user) {
    return (
      <h1>Loading</h1>
    )
  }

  return (
    <>
    <div className='lg:grid  lg:grid-cols-[15%_65%_20%] block' >
<MainHeader userActive={user} setOpenDialog2s={setOpenDialog} />
      <main className='w-full'>
        <div className={styles['publications-home']}>
          <Suspense fallback={<p className='h-full flex items-center text-3xl capitalize'>loading...</p>}>
        {state.publications.map((publication) => {
            const userFind = users?.filter(user => publication.user_id === user.id)
            return (
              
              <PublicationHome data={{ userFind, user, users, publication}} styles={styles} actions={{  onHandleDeletedLike, onHandleLikePublication }} key={publication.id} />
            )
          })}
          </Suspense>
        

        </div>
      </main>
      <aside style={{
        display:'flex',
        flexDirection:'column'
      }}>
        <div style={{
        margin:'15px',

        }} className='lg:flex flex-col text-center gap-5  hidden border rounded-2xl'>
          <h1 style={{
            fontSize:'40PX'
          }}>USERS</h1>
          {users.map((user)=>(
            <div style={{
             padding:'30px'
            }} className='flex items-center'>
          <Link style={{ width: '100px', marginRight: '10px' }} to={`/${user.username}`}>
              <Avatar className='size-20'>
  <AvatarImage src={user.profileImg?user.profileImg:'/profile2.svg'} />
  <AvatarFallback></AvatarFallback>
</Avatar>
          
          </Link>
              <h2 className='text-center'>{user.username}</h2>
            </div>
          ))}
        </div>
      </aside>
    </div>
      
    </>
  )
}
export default Home
