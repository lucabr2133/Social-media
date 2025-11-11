import { UUIDTypes } from "uuid"

async function onHandleFollow (userlId:UUIDTypes, userSessionId:UUIDTypes) {

  const response=await fetch('http://localhost:3000/followings/following', {
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
