import { Router } from 'express';
import commentRouter from './comments.route.js';
import followingRouter from './following.route.js';
import likesRouter from './likes.route.js';
import { Loginrouter } from './Logins.route.js';
import messagesRouter from './messages.route.js';
import publicationRouter from './publicattion.route.js';
import filesRouter from './files.route.js';
const router = Router();
router.use('/comments', commentRouter);
router.use('/followings', followingRouter);
router.use('/likes', likesRouter);
router.use('/logins', Loginrouter);
router.use('/messages', messagesRouter);
router.use('/publications', publicationRouter);
router.use('/',filesRouter)
export default router;
