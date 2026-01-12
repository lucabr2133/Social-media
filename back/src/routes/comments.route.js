import { Router } from 'express';
import ControlerData from '../controller/controller.js';
const commentRouter = Router();
commentRouter.post('/comments', async (req, res,next) => {
  try {
    const { comment, userId, publicationId } = req.body;
  const createComment = await ControlerData.createCommentController(comment, userId, publicationId);
  res.status(201).json({
    message: 'comment Created succeful',
    createComment
  });
  } catch (error) {
    next(error)
  }
  
});
commentRouter.get('/comments', async (req, res,next) => {
  try {
      const {publicationId}=req.query
  const comments = await ControlerData.getCommentController(publicationId);
  res.status(200).json(comments);

  } catch (error) {
    next(error)
  }


});
export default commentRouter;
