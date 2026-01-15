import { useEffect, useState } from 'react'
import { Publications } from '../types'
const apiUrl = import.meta.env.VITE_API_URL;
export type myError={
  message:string
}
function usePublication () {
  const [publication, setPublication] = useState<Publications[]|null>(null)
  const [error,setError]=useState<string|null>(null)
  const [loading,setLoading]=useState(true)

  useEffect(() => {
  const controller=new AbortController()

    async function getData () {

      try {
      const data = await fetch(`${apiUrl}/publications/publications`,{
        signal:controller.signal
      })
      const res= await data.json()
      if (!data.ok){
        const error= res as myError
        throw new Error(error.message)
      }
      setPublication(res as Publications[])
      } catch (error) {
           if (error instanceof DOMException && error.name === 'AbortError') return
          setError(error instanceof Error ? error.message : 'Unknown error')
      }finally{
        setLoading(false)
      }
 
    }
    getData()
    return ()=>{
      controller.abort()
    }
  }, [])
  return { publication,error,loading }
}
export default usePublication
