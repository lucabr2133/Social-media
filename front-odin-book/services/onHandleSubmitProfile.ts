import React from "react"
import { User } from "../src/types"

async function onHandleSubmitProfile (e:React.FormEvent<HTMLFormElement>, username:string) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
 

  const response = await fetch(`http://localhost:3000/profile/${username}`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  })
  const data:User = await response.json()
  return data
}
export default onHandleSubmitProfile
