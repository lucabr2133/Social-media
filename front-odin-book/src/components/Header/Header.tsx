import { Link } from 'react-router'
import React, { useState } from 'react'
import { User } from '../../types'
import CreatePublication from '../CreatePublication/CreatePublication'
import { Cross, User as Useri, Users } from 'lucide-react'
interface props{
  userActive:User,
  setOpenDialog2s:React.Dispatch<React.SetStateAction<boolean>>
}
function MainHeader ({ userActive, setOpenDialog2s }:props) {
  const [opendialog2, setOpenDialog2] = useState(false)

  return (
    <>
        <header   className='  bg-neutral-700/20 flex  z-10 fixed   ' style={{
          margin:'10px 0'
        }}>


      <ul className='lg:w-[15%] flex flex-row lg:flex-col bottom-0 fixed justify-around  lg:top-0 lg:justify-start bg-neutral-800 lg:bg-neutral-700/20 gap-2 *:min-h-[60px]  *:flex *:items-center *:text-3xl capitalize font-extrabold *:w-full w-full' style={{padding:'20px'}}>
        <li><Link to='/'><img width='20px' src='/homesvg.svg' alt='' /><h2 className='hidden lg:block'>Inicio</h2></Link></li>
        <li><Link to='/messages'><img width='20px' src='/messages.svg' /><h2 className='hidden lg:block'>Mensajes</h2></Link></li>
        {userActive && (<li><Link to={`/profile/${userActive.username}`}><Useri></Useri> <h2 className='hidden lg:block'>Profile</h2></Link></li>)}
        <li><Link to='/users'><Users></Users><h2 className='hidden lg:block'>Users</h2></Link></li>

        <li>
          <button onClick={() => {
            setOpenDialog2(true)
          }}
          ><Cross></Cross>
          </button>

        </li>
      </ul>
      
    </header>
    <CreatePublication opendialog={opendialog2} setOpenDialog={setOpenDialog2}></CreatePublication>
    </>

    
  )

}

export default MainHeader
