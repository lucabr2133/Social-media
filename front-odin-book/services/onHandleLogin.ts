import { UseFormSetError } from "react-hook-form";
import { Inputs } from "../src/components/Signup/Signup";
import React, { SetStateAction } from "react";
import { User } from "@/types";
const apiUrl = import.meta.env.VITE_API_URL;

async function onHandleSubmitLogin (data:Inputs,setUser:React.Dispatch<SetStateAction<User|null>>,setError:UseFormSetError<Inputs>) {
  
  const response = await fetch(`${apiUrl}/logins/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'

    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  const res = await response.json()
  
  if (res.error === 'Password doesnt match ') {
   setError("password", {
            type: "server",
            message: "Password dont match"
          })
      return false

  } 
  if(res.message=== 'User not found'){
    setError('username',{
      type:'server',
      message:"User not found"
    })
    return false
  }
  setUser(res.user)
   return true

}

export default onHandleSubmitLogin
