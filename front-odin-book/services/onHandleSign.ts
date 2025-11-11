import React from "react"
import { UseFormSetError } from "react-hook-form"
import { Inputs } from "../src/components/Signup/Signup"
async function onHandleSubmitSign (  data:  Inputs,setError:UseFormSetError<Inputs>)
   {
    
  const response = await fetch('http://localhost:3000/logins/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if(!response.ok){
    const {errors}=await response.json()
    
           if (errors.username === 'Username already exists') {
          setError("username", {
            type: "server",
            message: "This username is already taken"
          })
        } else {
          throw new Error(errors.message || "Error desconocido")
        }
        return // cortamos aquí para no continuar
  }
  const dataResponse = await response.json()
return dataResponse
}
export default onHandleSubmitSign
