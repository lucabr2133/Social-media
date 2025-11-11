import { UUIDTypes } from "uuid"
import { Following } from "../src/types"

async function onHandletFollow (followId:UUIDTypes) {
  const response=await fetch('http://localhost:3000/followings/following', {
    method: 'delete',
    credentials: 'include',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify({
      followId
    })
  })
  const data:Following= await response.json()
  return data
}
export default onHandletFollow
