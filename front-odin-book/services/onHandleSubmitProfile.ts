import React from "react"
import { User } from "../src/types"
const apiUrl = import.meta.env.VITE_API_URL;

async function onHandleSubmitProfile (e:React.FormEvent<HTMLFormElement>, username:string) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
 

  const response = await fetch(`${apiUrl}/profile/${username}`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  })
  const data:User = await response.json()
  return data
}
export default onHandleSubmitProfile
