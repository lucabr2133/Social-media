import React from "react"
import { User } from "../src/types"
const apiUrl = import.meta.env.VITE_API_URL;
import { toast } from 'react-hot-toast'

type Data={
  user:User
}

export async function onHandleSubmitProfile(
  e: React.FormEvent<HTMLFormElement>,
  username: string
) {
  e.preventDefault()

  try {
    const formData = new FormData(e.target as HTMLFormElement)

    const response = await fetch(`${apiUrl}/profile/${username}`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || 'Error al actualizar el perfil')
    }

    const data: Data = await response.json()

    toast.success('Perfil actualizado correctamente ✨')
    return data

  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Error unexpected'

    toast.error(message)
    return null
  }
}
