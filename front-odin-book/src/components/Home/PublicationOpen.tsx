import { Publications, User } from '../../types'
import CommentList from '../Profile/CommentList'
import React from 'react'
interface props{
  users:User[],
  user:User,
  styles:Record<string,string>
  publication:Publications,
  setOpen:React.Dispatch<React.SetStateAction<string>>
}
function PublicationOpen ({ users, styles, user, publication, setOpen }:props) {
  return (
    <div style={{margin:'5px'}}  onClick={(e) => {
      
        if (!e.currentTarget.closest(`.${styles['main-publication']}`) && !e.currentTarget.closest(`.displaymenu`)) { setOpen('') }
      }} className={`${styles['publication_dialog']}  h-full`}
    >
   
       

        <CommentList  styles={styles} users={users} user={user} publication={publication} />

    </div>
  )
}

export default PublicationOpen
