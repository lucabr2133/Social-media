import { Router } from "express";
import ControlerData from "../controller/controller.js";

const notifyRouter= Router()
notifyRouter.get('/notifications',async (req,res)=>{
    const {userId}=req.query
    
    const notifications=await ControlerData.getNotifyController(userId)
    res.json(notifications)
})
export default notifyRouter