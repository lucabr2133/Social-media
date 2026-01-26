import React from "react"
import { Publications } from "../src/types"
const apiUrl = import.meta.env.VITE_API_URL;
export type dataUpdated={
  publication:Publications,
  message:string
}
async function updatePublication (e:React.FormEvent<HTMLFormElement>, publicationId:string) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const response = await fetch(`${apiUrl}/publication/${publicationId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData
  })
  const data :dataUpdated = await response.json()
  return data
}
export default updatePublication
