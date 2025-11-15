import { Likes } from "../src/types"

async function onHandleDeletedLike (likeId:string):Promise<Likes> {
const apiUrl = import.meta.env.VITE_API_URL;

  const data = await fetch(`${apiUrl}/likes/likes`, {
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
