import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const followingRouter = Router();
followingRouter.post('/following', async (req, res) => {
  const { userSessionId, userlId } = req.body;
  
  const following = await ControlerData.followingUser(userSessionId, userlId);

  res.json(following);
});
followingRouter.get('/following', async (req, res) => {
  const following = await ControlerData.getfollowingUser();
  res.json(following);
});
followingRouter.delete('/following', async (req, res) => {
  const { followId } = req.body;
  const followDelete = await ControlerData.letFollow(followId);
  res.json( followDelete );
});
export default followingRouter;
