
export async function onHandleReadNotification(userId:string){
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

 await fetch(`${apiUrl}/notifications?userId=${userId}`,{
    method:'put',

  })

}