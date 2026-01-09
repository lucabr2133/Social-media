import React from 'react'
import './App.css'
import AppRoutes from './router/route'
import { useChatSocket } from './hooks/useChatSocket'
function App () {
  useChatSocket()
  return (
    <>
      <AppRoutes />
    </>
  )
}

export default App
