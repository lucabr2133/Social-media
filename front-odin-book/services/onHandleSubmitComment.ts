import React from "react"
import { socket } from "../src/socket"

async function onHandleSubmitComment (e:React.FormEvent<HTMLFormElement>, userId:string, publicationId:string) {
  
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const comment = formData.get('comment')
  socket.emit('publication comments',{text:comment,from:userId,publicationId})

}
export default onHandleSubmitComment
