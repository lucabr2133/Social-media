import { Router } from 'express';
import ControlerData from '../controller/controller.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
const messagesRouter = Router();

messagesRouter.post('/messages', async (req, res,next) => {
  try {
     const { message, receptorUser, user } = req.body;
  const messageCreate = await ControlerData.createMessageController(message, receptorUser.id, user.id);
  res.status(201).json({
    message: 'creado exitosamente',
    messageCreate
  });
  } catch (error) {
    next(error)
  }
 
});
messagesRouter.get('/messages', async (req, res,next) => {
  try {
      const messages = await ControlerData.getMessagesController();
  res.status(200).json(messages);
  } catch (error) {
    next(error)
  }

});
export default messagesRouter;
