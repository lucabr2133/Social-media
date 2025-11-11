import { useEffect, useState } from 'react'
import {Publications} from '../src/types'
function usePublication (userid:string|undefined) {
  
  const [publications, setPublication] = useState<Publications[]|null>(null)
  useEffect(() => {
    if(!userid)return
    async function GetPublication () {
      const res = await fetch(`http://localhost:3000/publications/${userid}/publication`)
      const data:Publications[] = await res.json()
      
      setPublication(data)
    }
    GetPublication()
  }, [userid])
  
  return { publications }
}
export default usePublication
