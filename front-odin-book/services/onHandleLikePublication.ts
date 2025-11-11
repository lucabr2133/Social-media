import React from "react"
import { UUIDTypes } from "uuid"
import { Likes } from "../src/types"

async function onHandleLikePublication (e:React.MouseEvent<HTMLImageElement>, publicationID:UUIDTypes, userActiveID:UUIDTypes) {

  const response = await fetch('http://localhost:3000/likes/likes', {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify({
      like: true,
      publicationID,
      userActiveID

    })
  })
  const data:Likes = await response.json()
  return data
}
export default onHandleLikePublication
