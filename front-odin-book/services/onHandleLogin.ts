import React from "react";
import { errorMesagges, User } from "../src/types";
import { NavigateFunction, useNavigate } from "react-router";

async function onHandleSubmitLogin (data,setUser,setError) {

  const response = await fetch('http://localhost:3000/logins/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'

    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  const res = await response.json()
  if (res.error === 'La contraseña no coincide') {
   setError("password", {
            type: "server",
            message: "Password dont match"
          })
  } 
   
   window.location.reload();

}

export default onHandleSubmitLogin
