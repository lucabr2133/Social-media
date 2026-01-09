import PublicationOpen from './PublicationOpen'
import { Link } from 'react-router'
import React, {  useState } from 'react'
import { Likes, Publications, User } from '../../types'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import {  X } from 'lucide-react'
import CommentList from '../Profile/CommentList'
interface actions {
  onHandleLikePublication:(e:React.MouseEvent<HTMLImageElement>,publicationId:string,userId:string)=>Promise<Likes>
  onHandleDeletedLike:(id:string)=>Promise<Likes>

}
interface data{
  publication:Publications,
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
  const { publication, user, users } = data

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
    <div className={`${styles['publication-container']}  flex w-full md:w-auto p-0  rounded-2xl shadow-2xl` } key={publication.id}>
  <div className='w-full lg:w-auto'>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link  to={`/profile/${publication.author?.username}`}>
            <img style={{ width: '40px' }} src={publication.author?.profileImg||'profile2.svg'} alt="" />
          </Link>
         <h1 className='capitalize font-extrabold '>{publication.author?.username}</h1> 
        </div>

        <img className='h-[calc(100vh-35vh)] w-full md:w-auto ' src={publication.image_url} alt="" />
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
           

            <div className='text-neutral-500 font-light capitalize' style={{padding:'20px 10px',fontSize:'12px'}}>{publication.content}</div>
          </div>
        </div>
      </div>


      <div 
    className={`
      bg-black
      lg:hidden 
      w-full 
      fixed 
      top-0 
      right-0
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
        <h2 className='w-full  text-[2px]!'>Comments</h2>
        <X onClick={()=>setOpen('')}></X>
        </div>
        {isOpen && <PublicationOpen publication={publication} setOpen={setOpen} user={user} users={users} styles={styles} />}
      
      </div>
    )}
  </div>
    {isOpen && <div className='fixed hidden lg:flex justify-center top-0 items-center left-0   z-50 w-screen h-screen bg-neutral-900/80 ' onClick={()=>{
    setOpen('')
  }}>
    <div className='flex  bg-amber-900 w-3/4 h-[calc(100vh-2vh)]'>
      <img src={publication.image_url} alt=""  className='flex-1'/>
      <div className='bg-black flex-1'>
        <CommentList  publication={publication} styles={styles} user={user} users={users}></CommentList>
      </div>
    </div>
  
  </div>}
    </div>
    
  )
}


export default PublicationHome
