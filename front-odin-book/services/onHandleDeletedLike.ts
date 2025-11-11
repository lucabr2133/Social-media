import { Likes } from "../src/types"

async function onHandleDeletedLike (likeId:string):Promise<Likes> {

  const data = await fetch('http://localhost:3000/likes/likes', {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify({
      likeId

    })
  })
  const res:Likes = await data.json()
  return res
}
export default onHandleDeletedLike
