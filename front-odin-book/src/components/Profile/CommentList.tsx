import onHandleSubmitComment from '../../../services/onHandleSubmitComment'
import useComments from '../../hooks/getComments'
import React, { useEffect } from 'react'
import { Comments, Publications, User } from '../../types'
import { socket } from '../../socket'
import { CommentSkeleton } from './CommentSkeleton'
interface props {
  styles:Record<string,string>
  publication:Publications,
  users:User[],
  user:User,
}
function  CommentList ({ publication, user }:props) {
  
  const { comments:commentsHook ,setComments ,loading} = useComments(publication.id)

useEffect(() => {
  if (!publication?.id) return;

  socket.emit("publicationRomm", publication.id);

  const handleComment = (comment: Comments) => {
    
    setComments((prev) => {
      return [...prev, comment]
    });
  };

  socket.on("publication comments", handleComment);

  return () => {
    socket.off("publication comments", handleComment);
  };
}, [publication.id, setComments]);


if(loading)return <div className='p-2 w-full h-full'>
  <CommentSkeleton></CommentSkeleton>
</div>
  return (
    <>
      <div className=' w-full h-[98vh] flex flex-col ' onClick={(e)=>{
        e.stopPropagation()
      }}>
        <header className=' w-full text-2xl p-6 border-b border-neutral-700'>
            <div className='flex items-center gap-2'>
              <img src={publication?.author?.profileImg||'/profile2.svg'} width={50} alt="" />
              <h6 className='text-[12px] capitalize'>{publication?.author?.username}</h6>
            </div>
            <p className='px-13 text-[13px] capitalize text-neutral-300!'>{publication?.content} .</p>
        </header>


        <main className='flex flex-col overflow-y-auto scrollbar-thumb-pink-950 justify-start! flex-1 '>
          {commentsHook?.map(comment=>(
            <div key={comment.id} className='p-4 '>
             <div className="flex flex-col  justify-center p-2 gap-2 ">
                <div className='flex items-center gap-2'>
                    <img  width={30} className="shrink-0" src={comment.author?.profileImg || "/profile2.svg"}alt=""/>
                    <p className="text-[10px] shrink-0 capitalize font-extrabold! ">
                              {comment.author?.username}
                    </p>
              </div>
   

              <p className="text-[11px] capitalize wrap-break-word px-10 text-neutral-500! font-mono!">
                {comment.content}.
              </p>
            </div>
                <hr className='w-1/12 mx-10 border-neutral-700' ></hr>
            </div>
          ))}
        </main>
          
    <footer>
      <form className='w-full flex px-3 py-2 gap-2 items-center' onSubmit={(e)=>{
        onHandleSubmitComment(e,user.id,publication.id)
      }}>

        <input className='flex-2 rounded-2xl! h-8 ' type="text" name='comment' placeholder='Write....' />
        <button className='flex-1' type='submit'>Submit</button>

      </form>
      
    </footer>
      </div>
    </>
  )
}

export default CommentList
