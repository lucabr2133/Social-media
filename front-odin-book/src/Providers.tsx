import App from './App.js'

import useUsers from './hooks/useUsers.js'
import useUserSession from './hooks/getUserSession.js'
import { UserSession, UserContext } from './contex/context.js'
import React from 'react'
import { FollowProvider } from './contex/FollowContext.js'
import { PublicationProvider } from './contex/PublicationContext.js'

function AppWithProviders () {
  const { users } = useUsers()

  const { user, loading, setUser } = useUserSession()

  return (
    <FollowProvider>

      <UserSession.Provider value={{ user, loading, setUser }}>
        <UserContext.Provider value={users}>
          <PublicationProvider>
            <App />
          </PublicationProvider>
        </UserContext.Provider>
      </UserSession.Provider>
    </FollowProvider>

  )
}
export default AppWithProviders
