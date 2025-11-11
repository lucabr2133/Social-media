import React from "react"
import { Publications } from "../src/types"

async function updatePublication (e:React.FormEvent<HTMLFormElement>, publicationId:string) {
  e.preventDefault()
  const formData = new FormData(e.target as HTMLFormElement)
  const response = await fetch(`http://localhost:3000/publication/${publicationId}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData
  })
  const data :Publications = await response.json()
  return data
}
export default updatePublication
