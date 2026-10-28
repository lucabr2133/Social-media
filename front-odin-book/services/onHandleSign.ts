import { UseFormSetError } from "react-hook-form"
import { Inputs } from "../src/components/Signup/Signup"

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function onHandleSubmitSign(data: Inputs, setError: UseFormSetError<Inputs>) {
  const response = await fetch(`${apiUrl}/logins/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    const resData = await response.json().catch(() => ({}))
    const errors = resData.errors || resData

    if (errors?.username === 'Username already exists' || resData.error === 'Username already exists') {
      setError("username", {
        type: "server",
        message: "This username is already taken"
      })
    } else {
      setError("username", {
        type: "server",
        message: errors?.username || resData.error || "Error creating user"
      })
    }
    return
  }
  const dataResponse = await response.json()
  return dataResponse
}
export default onHandleSubmitSign
