
export async function onHandleReadNotification(userId:string){
const apiUrl = import.meta.env.VITE_API_URL;

 await fetch(`${apiUrl}/notifications?userId=${userId}`,{
    method:'put',

  })

}