import { UseFormSetError } from "react-hook-form"
import { Inputs } from "../src/components/CreatePublication/CreatePublication"
import { User } from "../src/types"
async function onHandleSubmitCreatePublication (data:Inputs, userActive:User,setError:UseFormSetError<Inputs>) {
    const formData = new FormData();
    formData.append("description", data.description);
      formData.append("publicationImg", data.publicationImg[0]); 

  const response = await fetch(`http://localhost:3000/${userActive.id}/publication/`, {
    method: 'POST',
    credentials: 'include',
    body: formData

  })
  if(!response.ok){
    const errorData= await response.json()
    setError('publicationImg',{
      message:errorData.message
    })
    return
  }
  const validData = await response.json()
  return validData
}
export default onHandleSubmitCreatePublication
