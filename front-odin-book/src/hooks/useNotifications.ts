import { notifications as notifyType } from '@/types'
import { useEffect, useState } from 'react'
const apiUrl = import.meta.env.VITE_API_URL
export function useNotification (userId:string) {
  const [notifications, setNotification] = useState<notifyType[]|undefined>()
  useEffect(() => {
    fetch(`${apiUrl}/notifications?userId=${userId}`).then((response)=>{
        if(!response.ok){
            throw new Error('Cannot fetch')
        } 
        response.json().then((data:notifyType[])=>{
        
            setNotification(data)     
        })   
    }).catch((e)=>{
        console.error(e)
    })
  }, [userId])
  return {notifications,setNotification}
}
