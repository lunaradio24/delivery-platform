import express from 'express';
import { authRouter } from './auth.router.js';
import { userRouter } from './user.router.js';
import { storeRouter } from './store.router.js';
import { menuRouter } from './menu.router.js';
import { cartRouter } from './cart.router.js';
import { orderRouter } from './order.router.js';
import { reviewRouter } from './review.router.js';
import { likeRouter } from './like.router.js';
import { transactionLogRouter } from './transaction-log.router.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';
import { imageRouter } from './image.router.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', requireAccessToken, userRouter);
apiRouter.use('/stores', storeRouter);
apiRouter.use('/stores/:storeId/menus', menuRouter);
apiRouter.use('/carts', requireAccessToken, requireRoles(['CUSTOMER']), cartRouter);
apiRouter.use('/orders', requireAccessToken, orderRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/likes', requireAccessToken, requireRoles(['CUSTOMER']), likeRouter);
apiRouter.use('/transaction-logs', requireAccessToken, transactionLogRouter);
apiRouter.use('/image', imageRouter)

export { apiRouter };
