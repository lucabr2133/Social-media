import { Router } from 'express';
import ControlerData from '../controller/controller.js';
import { prisma } from '../model/prismamodel.js';

const followingRouter = Router();

followingRouter.post('/following', async (req, res, next) => {
  try {
    const { userSessionId, userlId } = req.body;
    const following = await ControlerData.followingUser(userSessionId, userlId);

    // Emit real-time notification if io is available
    const io = req.app.get('io');
    if (io && userSessionId && userlId && userSessionId !== userlId) {
      try {
        const latestNotification = await prisma.notifcations.findFirst({
          where: {
            user_id: userlId,
            actorId: userSessionId,
            type: 'follow',
          },
          include: {
            actor: {
              select: { id: true, username: true, profileImg: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
        if (latestNotification) {
          io.to(userlId).emit('notifications', latestNotification);
        }
      } catch {
        // non-critical
      }
    }

    res.status(201).json(following);
  } catch (error) {
    next(error);
  }
});

followingRouter.get('/following', async (req, res, next) => {
  try {
    const following = await ControlerData.getfollowingUser();
    res.status(200).json(following);
  } catch (err) {
    next(err);
  }
});

followingRouter.delete('/following', async (req, res, next) => {
  try {
    const { followId } = req.body;
    const followDelete = await ControlerData.letFollow(followId);
    res.status(200).json(followDelete);
  } catch (error) {
    next(error);
  }
});

export default followingRouter;
