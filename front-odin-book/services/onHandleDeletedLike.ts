import { Likes } from "../src/types"

async function onHandleDeletedLike(likeId: string): Promise<Likes | null> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const data = await fetch(`${apiUrl}/likes/likes`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-type': 'Application/json'
    },
    body: JSON.stringify({
      likeId
    })
  });

  if (data.status === 204) {
    return null;
  }

  const text = await data.text();
  return text ? JSON.parse(text) : null;
}

export default onHandleDeletedLike;
