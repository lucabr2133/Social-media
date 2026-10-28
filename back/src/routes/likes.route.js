import { Router } from 'express';
import ControlerData from '../controller/controller.js';
import { prisma } from '../model/prismamodel.js';

const likesRouter = Router();

likesRouter.post('/likes', async (req, res, next) => {
  try {
    const { likes, publicationID, userActiveID } = req.body;
    const likesPublication = await ControlerData.postLikePublication(likes, publicationID, userActiveID);

    // Emit real-time like notification to post owner
    const io = req.app.get('io');
    if (io && publicationID && userActiveID) {
      try {
        const post = await prisma.publications.findUnique({
          where: { id: publicationID },
          select: { user_id: true },
        });
        if (post && post.user_id !== userActiveID) {
          const latestNotification = await prisma.notifcations.findFirst({
            where: {
              user_id: post.user_id,
              actorId: userActiveID,
              type: 'like',
            },
            include: {
              actor: {
                select: { id: true, username: true, profileImg: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          });
          if (latestNotification) {
            io.to(post.user_id).emit('notifications', latestNotification);
          }
        }
      } catch {
        // non-critical
      }
    }

    res.status(201).json(likesPublication);
  } catch (error) {
    next(error);
  }
});

likesRouter.delete('/likes', async (req, res, next) => {
  try {
    const { likeId } = req.body;
    const likesPublication = await ControlerData.deleteLikePublication(likeId);
    res.status(200).json({ likesPublication, redirectUrl: process.env.CLIENT_URL || 'http://localhost:5173/' });
  } catch (error) {
    next(error);
  }
});

likesRouter.get('/likes', async (req, res, next) => {
  try {
    const likesPublication = await ControlerData.getLikePublication();
    res.status(200).json(likesPublication);
  } catch (error) {
    next(error);
  }
});

export default likesRouter;
