import { Link } from 'react-router'
import React, { useState } from 'react'
import { User } from '../../types'
import CreatePublication from '../CreatePublication/CreatePublication'
import { Bell, Cross, User as Useri, Users, X } from 'lucide-react'
import { useNotification } from '../../hooks/useNotifications'
import { onHandleReadNotification } from '../../../services/onHandleReadNotification'
interface props{
  userActive:User,
}
function MainHeader ({ userActive }:props) {
  const [opendialog2, setOpenDialog2] = useState(false)
  const [openNotifications,setOpenNotifications]=useState(false)
  const {notifications}=useNotification(userActive.id)

  if(!notifications) return <p>loading</p>
  return (
    <>
        <header   className='  bg-neutral-700/20 flex  z-10 fixed    ' style={{
          margin:'10px 0'
        }}>


      <ul className='lg:w-[15%] flex flex-row lg:flex-col bottom-0 fixed justify-around  lg:top-0 lg:justify-start bg-neutral-800 lg:bg-transparent border-r border-neutral-700 gap-2 *:min-h-15 *:flex *:items-center  capitalize font-extralight *:w-full w-full' style={{padding:'20px'}}>
        <li><Link to='/'><img width='20px' src='/homesvg.svg' alt='' /><h2 className='hidden lg:block'>Inicio</h2></Link></li>
        <li><Link to='/messages'><img width='20px' src='/messages.svg' /><h2 className='hidden lg:block'>Mensajes</h2></Link></li>
        {userActive && (<li><Link to={`/profile/${userActive.username}`}><Useri></Useri> <h2 className='hidden lg:block'>Profile</h2></Link></li>)}
        <li><Link to='/users'><Users></Users><h2 className='hidden lg:block'>Users</h2></Link></li>
        <li>
          <div onClick={()=>{
              setOpenNotifications(true)
          }} className=' cursor-pointer flex gap-2 hover:bg-neutral-700 duration-200 rounded-2xl p-2'>
    <Bell ></Bell>
         <div className='hidden lg:flex gap-2  flex-wrap '>  <p>Notifications</p> <h2 className='bg-red-700 rounded-4xl w-5  h-5 flex justify-center items-center'>{notifications?.filter((notification)=>!notification.read).length ||0}</h2></div>
          </div>
        </li>
        <li className='flex gap-2  rounded-2xl cursor-pointer' onClick={()=>{
            setOpenDialog2(true)

        }}>
          <div className='flex gap-2 hover:bg-neutral-700 duration-200 rounded-2xl p-2'>
    <Cross ></Cross>
         <h2 className='hidden lg:block '>Create</h2>
          </div>  
    

        </li>
      </ul>
      
    </header>
    <CreatePublication opendialog={opendialog2} setOpenDialog={setOpenDialog2}></CreatePublication>
       {openNotifications && (
  <div
    onClick={() => {
      setOpenNotifications(false)
      onHandleReadNotification(userActive.id)


    }}
    className="fixed w-screen h-screen flex justify-center items-center z-10 bg-neutral-900/90"
  >
    <div
      onClick={(e) => e.stopPropagation()} 
      className="bg-neutral-800 w-full lg:w-1/3 h-[90%] rounded-2xl flex flex-col"
    >
      <header className='border-b border-neutral-500 flex justify-between p-2'>
        <h2 className="text-center">Notifications</h2>
      <X className='lg:hidden' onClick={()=>{
        setOpenNotifications(false)
      onHandleReadNotification(userActive.id)

      }}></X>
      </header>
      <div>
        {notifications?.map((notification)=>{
           const now = Date.now()
  const date = new Date(notification.createdAt).getTime()

  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)

          return <div
  key={notification.id}
  className="
    flex items-center gap-4
    bg-neutral-800/60 hover:bg-neutral-700/60
    border border-neutral-700/50
    p-4 rounded-xl m-2
    transition-colors
  "
>
  <img
    src={notification.actor.profileImg || "/profile2.svg"}
    alt={notification.actor.username}
    className="w-10 h-10 rounded-full object-cover"
  />

  <div className="flex-1">
    <p className="text-sm text-neutral-200 leading-tight">
      <span className="font-semibold">
        {notification.actor.username}
      </span>{" "}
      empezó a seguirte
    </p>

    <span className="text-xs text-neutral-400">
      {diffMinutes} min
    </span>
  </div>

  {!notification.read && (
    <span className="w-2 h-2 bg-blue-500 rounded-full" />
  )}
</div>

        })}
      </div>
    </div>
  </div>
)}
    </>
    
  )

}

export default MainHeader
