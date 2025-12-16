import { Navigate, Outlet } from 'react-router'
import { useContext } from 'react'
import { UserSession } from '../contex/context'

export default function PublicRoute () {
  const session = useContext(UserSession)

  if (!session) throw new Error('PublicRoute outside provider')

  const { user, loading } = session

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center flex-col gap-5'>
        <h2>Loading...</h2>
        <div className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin' />
      </div>
    )
  }

  if (user) {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
