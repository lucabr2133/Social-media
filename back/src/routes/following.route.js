import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const followingRouter = Router();
followingRouter.post('/following', async (req, res,next) => {
  try {
      const { userSessionId, userlId } = req.body;
      console.log(userSessionId,userlId);
  
  const following = await ControlerData.followingUser(userSessionId, userlId);

  res.status(201).json(following);
  } catch (error) {
    next(error)
  }

});
followingRouter.get('/following', async (req, res,next) => {
  try{
  const following = await ControlerData.getfollowingUser();
  res.status(200).json(following);

  }catch(err){
    next(err)
  }
});
followingRouter.delete('/following', async (req, res,next) => {
  try {
      const { followId } = req.body;
      
  const followDelete = await ControlerData.letFollow(followId);
  
  res.status(200).json( followDelete );

  } catch (error) {
    next(error)
  }

});
export default followingRouter;
