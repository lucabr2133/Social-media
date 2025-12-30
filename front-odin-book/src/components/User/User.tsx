import useFollowing from '../../hooks/useFollowing'
import CreatePublication from '../CreatePublication/CreatePublication'
import { useState, useContext, useReducer, useEffect, SetStateAction } from 'react'
import onHandleFollow from '../../../services/onHandleFollow'
import onHandletFollow from '../../../services/onHandletFollow'
import styles from './User.module.css'
import MainHeader from '../Header/Header'
import { UserContext, UserSession } from '../../contex/context'
import React from 'react'
import { Following, User } from '../../types'
import useUsers from '@/hooks/useUsers'
import { Spinner } from '@heroui/react'
import { SpinnerComponnet } from '../ui/spinner'
interface actionFollow{
  type:'follow',
  follower:Following
}
interface actionUnfollow{
  type:'unfollow',
  followId:string
}
interface actionSet{
  type:'set',
  followers:Following[]
}
type myAction = actionFollow|actionUnfollow|actionSet
interface myState{
  following:Following[]
}
const apiUrl = import.meta.env.VITE_API_URL;

function userReducer(state:myState,action:myAction){
 switch (action.type) {
    case 'follow':
      return {
        ...state,
        following: [...state.following, action.follower]
      }
    case 'unfollow':
      return {
        ...state,
        following: state.following.filter(follow => follow.id !== action.followId)
      }
      case 'set':
        return{
          ...state,
        following:action.followers
        }
    default:
      return state
  }
}
export function Users() {
  // const contextUser = useContext(UserContext)
  const contextUserSession = useContext(UserSession)
  if (!contextUserSession) {
    throw new Error('you must provide the correct value types')
  }
  // const users = contextUser
  const { user } = contextUserSession

  const { following } = useFollowing()
  const [opendialog, setOpenDialog] = useState(false)
  const [users,setUsers]=useState<User[]>([])
  const [loading,setLoading]=useState(false)
  const [input,setInputValue]=useState('')
  const [state,dispatch]=useReducer(userReducer,{following:[]})
    useEffect(() => {
      if (following) {
        dispatch({ type: 'set', followers: following })
      }
    }, [following])


  useEffect(() => {

  const controller = new AbortController()

  const timeout = setTimeout(async () => {
    setLoading(true)

    try {
      const res = await fetch(
        `${apiUrl}/logins/users?username=${input}`,
        { signal: controller.signal }
      )

      if (!res.ok) throw new Error('Error en búsqueda')

      const data = await res.json()
      
      setUsers(data)
    setLoading(false)
      

    } catch (err) {
    setLoading(false)

      if (err.name !== 'AbortError') {
        console.error(err)
      }
    }
  }, 300) // debounce

  return () => {

    clearTimeout(timeout)
    controller.abort()
  }
}, [input])

  if (!users || !user || !following) return <>loading...</>

  const isFollowing = (userId: string) =>{
return state.following.some(
      (f) => f.following_id === user.id && f.follower_id === userId
    )
  }
    

  return (
    <>
    <div className='lg:grid lg:grid-cols-[15%_85%] w-full' style={{
      display:"grid",
    }}>
        <MainHeader userActive={user} setOpenDialog2s={setOpenDialog} />
    <div className='col-start-1 lg:col-start-2 lg:col-end-3 ' 
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#121212',
          color: '#eee',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '0 40px',
          boxSizing: 'border-box',
        }}
      >
   <div className=' z-20 my-5! p-5!'>
            <input value={input} onChange={(e)=>{
              setInputValue(e.currentTarget.value)
            }} type="text" className=' w-full rounded-2xl!'  placeholder='Search user...'/>
          </div>
        <div
          style={{
            flex: 1,
            paddingTop: 30,
            // Ya no hay maxWidth para que ocupe más horizontal
            width: '100%',
            margin: '0 auto',
          }}
          className={styles.usersContainer}
        >
       
          <h2
            style={{
              textAlign: 'center',
              marginBottom: 40,
              color: '#4a90e2',
              fontWeight: 'bold',
              fontSize: '2rem',
            }}
          >
            Usuarios
          </h2>
   {loading && <div className='flex justify-center items-center gap-5'>
              <p>Loading</p>
               <SpinnerComponnet></SpinnerComponnet>
               </div>}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 30,
            }}
            hidden={loading}
          >
         
            {users.length!==0?users
              .filter((u) => u.username !== user.username)
              .map((userl) => (
                <div
                  key={userl.id}
                  style={{
                    backgroundColor: '#1e1e1e',
                    borderRadius: 16,
                    padding: 30,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 25,
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.03)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  <img
                    src={userl.profileImg || 'profile2.svg'}
                    alt={`${userl.username} profile`}
                    width={70}
                    height={70}
                    style={{
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2.5px solid #4a90e2',
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        fontWeight: '700',
                        color: '#ddd',
                        fontSize: '1.4rem',
                        userSelect: 'none',
                      }}
                    >
                      {userl.username}
                    </h3>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        const checked = state.following.filter(
                          (f) =>
                            f.following_id === user.id &&
                            f.follower_id === userl.id
                        )
                        if (checked.length > 0) {
                          const follow=await onHandletFollow(checked[0].id)
                          dispatch({type:'unfollow',followId:follow.id})
                        } else {
                       const follow=await    onHandleFollow(userl.id, user.id)
                       dispatch({type:'follow',follower:follow})
                        }
                      }}
                      style={{
                        backgroundColor: isFollowing(userl.id)
                          ? '#e74c3c'
                          : '#4a90e2',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: 24,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 16,
                        transition: 'background-color 0.3s ease',
                        userSelect: 'none',
                        alignSelf: 'start',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = isFollowing(userl.id)
                          ? '#c0392b'
                          : '#357abd')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = isFollowing(userl.id)
                          ? '#e74c3c'
                          : '#4a90e2')
                      }
                    >
                      
                      {isFollowing(userl.id) ? 'Unfollow' : 'Follow'}
                    </button>
                  </div>
                </div>
              )):<h2 className='text-center col-end-3 col-start-1'>No se encontraron Usuarios</h2>}
          </div>
        </div>
      </div>
    </div>
  

      <CreatePublication opendialog={opendialog} setOpenDialog={setOpenDialog} />
    </>
  )
}
