import { Router } from 'express';
import ControlerData from '../controller/controller.js';
import { Server } from 'socket.io';
import { createServer } from 'node:http';
const messagesRouter = Router();

messagesRouter.post('/messages', async (req, res) => {
  const { message, receptorUser, user } = req.body;
  const messageCreate = await ControlerData.createMessageController(message, receptorUser.id, user.id);
  res.json({
    message: 'creado exitosamente',
    messageCreate
  });
});
messagesRouter.get('/messages', async (req, res) => {
  const messages = await ControlerData.getMessagesController();
  res.json(messages);
});
export default messagesRouter;
