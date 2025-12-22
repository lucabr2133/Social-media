import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'
import Login from '../components/Login/Login'
import Signup from '../components/Signup/Signup'
import Home from '../components/Home/Home'
import { Messages } from '../components/Messages/Messages'
import { Users } from '../components/User/User'
import Profile from '../components/Profile/Profile'
import App from '@/App'

export default function AppRoutes () {
  return (
    <Routes>

      <Route element={<PublicRoute />}>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path='/' element={<Home />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/users' element={<Users />} />
        <Route path='/profile/:username' element={<Profile />} />
      </Route>

    </Routes>

  )
}
