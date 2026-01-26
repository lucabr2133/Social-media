import { useEffect, useState } from 'react'
import { Publications } from '../types'
import { usePublicationContext } from '../contex/PublicationContext';
const apiUrl = import.meta.env.VITE_API_URL;
export type myError={
  message:string
}
function usePublication () {
  const { setAction}=usePublicationContext()

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
      setAction(res as Publications[])
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
  }, [setAction])
  return { error,loading }
}
export default usePublication
