import { SetStateAction } from "react";
import { User } from "../src/types";
import React from "react";
import { UseFormSetError } from "react-hook-form";
import { Inputs } from "../src/components/Signup/Signup";
import { Navigate } from "react-router";
const apiUrl = import.meta.env.VITE_API_URL;

async function onHandleSubmitLogin (data:Inputs,setUser:React.Dispatch<SetStateAction<User|null>>,setError:UseFormSetError<Inputs>) {
  console.log(apiUrl);
  
  const response = await fetch(`${apiUrl}/logins/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'

    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  const res = await response.json()
  console.log(res);
  
  if (res.error === 'La contraseña no coincide') {
   setError("password", {
            type: "server",
            message: "Password dont match"
          })
  return

  } 
   
   window.location.href='/'

}

export default onHandleSubmitLogin
