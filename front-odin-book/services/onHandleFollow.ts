import { UUIDTypes } from "uuid"
const apiUrl = import.meta.env.VITE_API_URL;

async function onHandleFollow (userlId:UUIDTypes, userSessionId:UUIDTypes) {

  const response=await fetch(`${apiUrl}/followings/following`, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify({
      userlId,
      userSessionId
    })
  })
  const data= await response.json()
  return data
}
export default onHandleFollow
