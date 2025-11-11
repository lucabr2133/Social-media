import React from "react"
import {socket} from '../src/socket'
import { User } from "../src/types"
async function onHandleMessageSubmit (e:React.FormEvent<HTMLFormElement>, user:User, receptorUser:User) {
  e.preventDefault()
  const formdata = new FormData(e.target as HTMLFormElement)
  const message = formdata.get('message')
  

socket.emit("chat message", {
  
  from: user.id,
  text: message,
  to:receptorUser.id
});


  // if (!user || !receptorUser) {
  //   console.error('Error: Falta información del usuario o receptor')
  //   return
  // }
  // if (!message) return
  // await fetch('http://localhost:3000/messages/messages', {
  //   method: 'POST',
  //   credentials: 'include',
  //   headers: {
  //     'Content-type': 'Application/json'
  //   },
  //   body: JSON.stringify(
  //     {
  //       message,
  //       receptorUser,
  //       user

  //     }
  //   )
  // })
}
export default onHandleMessageSubmit
