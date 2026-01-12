import { Router } from "express";
import ControlerData from "../controller/controller.js";

const notifyRouter= Router()
notifyRouter.get('/notifications',async (req,res,next)=>{
    try {
         const {userId}=req.query
    
    const notifications=await ControlerData.getNotifyController(userId)
    res.status(200).json(notifications)
    } catch (error) {
        next(error)
    }
   
})
notifyRouter.put('/notifications',async (req,res,next)=>{
    try {
         const {userId}=req.query
    
    const readNotifications=ControlerData.updateNotifyController(userId)    
    res.status(200).json(readNotifications)  
    } catch (error) {
        next(error)
    }
   
})
export default notifyRouter