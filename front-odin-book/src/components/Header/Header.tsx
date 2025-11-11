import { Link } from 'react-router'
import React, { useState } from 'react'
import { User } from '../../types'
import CreatePublication from '../CreatePublication/CreatePublication'
interface props{
  userActive:User,
  setOpenDialog2s:React.Dispatch<React.SetStateAction<boolean>>
}
function MainHeader ({ userActive, setOpenDialog2s }:props) {
  const [opendialog2, setOpenDialog2] = useState(false)

  return (
    <>
        <header   className=' header '>
      <ul >
        <li><Link to='/'><img width='20px' src='/homesvg.svg' alt='' />Inicio</Link></li>
        <li><Link to='/messages'><img width='20px' src='/messages.svg' />Mensajes</Link></li>
        {userActive && (<li><Link to={`/${userActive.username}`}><img width='40px' src={userActive.profileImg ? `${userActive.profileImg}` : 'profile2.svg'} alt='' />Profile</Link></li>)}
        <li><Link to='/users'>Users</Link></li>

        <li>
          <button onClick={() => {
            setOpenDialog2(true)
          }}
          ><img width='20px' src='/plus.svg' alt='' />
          </button>

        </li>
      </ul>
      
    </header>
    <CreatePublication opendialog={opendialog2} setOpenDialog={setOpenDialog2}></CreatePublication>
    </>

    
  )

}

export default MainHeader
