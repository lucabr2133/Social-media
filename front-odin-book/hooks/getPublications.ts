import { useEffect, useState } from 'react'
import { Publications } from '../src/types'

function usePublication () {
  const [publication, setPublication] = useState<Publications[]|null>(null)
  useEffect(() => {
    async function getData () {
      const data = await fetch('http://localhost:3000/publications/publications')
      const res:Publications[] = await data.json()
      setPublication(res)
    }
    getData()
  }, [])
  return { publication }
}
export default usePublication
