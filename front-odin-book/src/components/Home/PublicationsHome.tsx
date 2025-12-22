import PublicationOpen from './PublicationOpen'
import { Link } from 'react-router'
import React, {  useState } from 'react'
import { Likes, Publications, User } from '../../types'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import {  X } from 'lucide-react'
interface actions {
  onHandleLikePublication:(e:React.MouseEvent<HTMLImageElement>,publicationId:string,userId:string)=>Promise<Likes>
  onHandleDeletedLike:(id:string)=>Promise<Likes>

}
interface data{
  publication:Publications,
  userFind:User[],
  user:User,
  users:User[]
}
type props={
  data:data,
  actions:actions,
  styles:Record<string,string>
}


function PublicationHome({ styles, actions, data }: props) {
  const [open, setOpen] = useState('')
  const { publication, userFind, user, users } = data

  const {addLike,deleteLike,state}=usePublicationLikes()
  const { onHandleLikePublication, onHandleDeletedLike } = actions
   
  const isOpen = open === publication.id
async function onHandleClickLike(e:React.MouseEvent<HTMLImageElement,MouseEvent>){
  const checked = state.likes.filter(like => like.post_id === publication.id && like.user_id === user.id)
                if (checked.length > 0) {
                  deleteLike(checked[0])
                  onHandleDeletedLike(checked[0].id)
                } else {
                  const like = await onHandleLikePublication(e, publication.id, user.id)
                  addLike(like)
                }

}
  return (
    <div className={`${styles['publication-container']} bg-neutral-700/35 flex w-full md:w-auto p-0  rounded-2xl shadow-2xl` } key={publication.id}>
  <div className='w-full lg:w-auto'>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link  to={`/profile/${userFind[0]?.username}`}>
            <img style={{ width: '70px' }} src={userFind[0]?.profileImg||'profile2.svg'} alt="" />
          </Link>
         <h1 className='capitalize font-extrabold text-2xl'>{userFind[0]?.username}</h1> 
        </div>

        <img className='h-[calc(100vh-35vh)] w-full md:w-auto' src={publication.image_url} alt="" />
        <div className={styles['publication-content']}>
          <div className='flex flex-col gap-5'>
            <div className='flex w-full items-center gap-5' style={{padding:'10px'}}>
             <img
              aria-label="likeimg"
              onClick={(e)=>{onHandleClickLike(e)}}
              src={state.likes.some(like => like.post_id === publication.id && like.user_id === user.id) ? '/likeActive.svg' : '/offlike.svg'}
              width="30px"
              alt=""
            />
            <h4 className='text-center text-2xl'>{state.likes.filter((n) => n.post_id === publication.id).length}</h4>

            <img
              onClick={() => {
                setOpen(isOpen ? '' : publication.id) // toggle open/close
              }}
              src="/comment1.svg"
              width="30px"
              alt=""
              style={{ cursor: 'pointer' }}
            />
            </div>
           

            <div className='p-5' style={{padding:'5px'}}>{publication.content}</div>
          </div>
        </div>
      </div>

      <div
      className={`${styles["main-publication"]} hidden `}
        style={{
          width: isOpen ? '500px' : '0px', // ancho cerrado o abierto
          overflow: 'hidden',
          whiteSpace: 'nowrap', // para que no baje a varias líneas si hay texto
          transition: 'width 0.5s ease',
        }}
      >
        {isOpen && <PublicationOpen publication={publication} setOpen={setOpen} user={user} users={users} styles={styles} />}
      </div>
      <div 
    className={`
      bg-black
      md:hidden 
      w-full 
      fixed 
      top-0 
      overflow-hidden 
      transition-all 
      duration-500 
      ease-in-out 
      ${isOpen ? 'h-full' : 'h-0'}
    `}
  >
    {isOpen && (
      <div className="p-4 text-white h-full displaymenu">
        <div className='flex' style={{padding:'10px'}}>
        <h2 className='w-full  uppercase text-2xl'>Comments</h2>
        <X onClick={()=>setOpen('')}></X>
        </div>
        {isOpen && <PublicationOpen publication={publication} setOpen={setOpen} user={user} users={users} styles={styles} />}
      
      </div>
    )}
  </div>
    </div>
    
  )
}


export default PublicationHome
