import App from './App.js'
import Signup from './components/Signup/Signup.js'
import Profile from './components/Profile/Profile.jsx'
import GitHubRedirect from './components/GitHubRedirect.jsx'
import useUsers from './hooks/useUsers.js'
import useUserSession from './hooks/getUserSession.js'
import usePublication from './hooks/getUserPublicattion.js'
import { reducer } from './Reducers/PublicationReducer.js'
import { PublicationContext, UserSession, UserContext } from './contex/context.js'
import React, { useEffect, useReducer } from 'react'
import { Routes, Route } from 'react-router'

import { Messages } from './components/Messages/Messages.jsx'
import { Users } from './components/User/User.js'
import { Home } from 'lucide-react'
import Login from './components/Login/Login.js'
import AppRoutes from './router/route.js'
function AppWithProviders () {
  const { users } = useUsers()

  const { user, loading, setUser } = useUserSession()

  const { publications } = usePublication(user?.id ?? undefined)
  const initialState = { publications: [] }
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!publications) return
    if (publications.length === 0) return // no dispatch con array vacío
    dispatch({ type: 'set', publications })
  }, [publications, dispatch])

  return (
    <UserSession.Provider value={{ user, loading, setUser }}>
      <UserContext.Provider value={users}>
        <PublicationContext.Provider value={{ state, dispatch }}>
          <App />
        </PublicationContext.Provider>
      </UserContext.Provider>
    </UserSession.Provider>
  )
}
export default AppWithProviders
