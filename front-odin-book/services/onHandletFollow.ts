import { UUIDTypes } from "uuid"
import { Following } from "../src/types"
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function onHandletFollow (followId:UUIDTypes) {
  
  const response=await fetch(`${apiUrl}/followings/following`, {
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
