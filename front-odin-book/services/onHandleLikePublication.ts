import React from "react"
import { UUIDTypes } from "uuid"
import { Likes } from "../src/types"
const apiUrl = import.meta.env.VITE_API_URL;

async function onHandleLikePublication (e:React.MouseEvent<HTMLImageElement>, publicationID:string, userActiveID:string):Promise<Likes> {
console.log(publicationID,userActiveID);

const response = await fetch(`${apiUrl}/likes/likes`, {
  method: 'post',
  credentials: 'include',
  headers: {
    'Content-type': 'Application/json'
  },
  body: JSON.stringify({
    likes: true,
    publicationID,
    userActiveID

  })
})
const data:Likes = await response.json()
return data
}
export default onHandleLikePublication
