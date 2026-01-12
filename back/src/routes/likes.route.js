import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const likesRouter = Router();
likesRouter.post('/likes', async (req, res,next) => {
  try {
      const { likes, publicationID, userActiveID } = req.body;
  const likesPublication = await ControlerData.postLikePublication(likes, publicationID, userActiveID);
  res.status(201).json(likesPublication);
  } catch (error) {
    next(error)
  }

});
likesRouter.delete('/likes', async (req, res,next) => {
  try {
      const { likeId } = req.body;
  const likesPublication = await ControlerData.deleteLikePublication(likeId);
  res.status(204).json({ likesPublication, redirectUrl: 'http://localhost:5173/' });
  } catch (error) {
    next(error)
  }

});
likesRouter.get('/likes', async (req, res,next) => {
  try {
  const likesPublication = await ControlerData.getLikePublication();
  res.status(200).json(likesPublication);
    
  } catch (error) {
      next(error)
  }

});
export default likesRouter;
