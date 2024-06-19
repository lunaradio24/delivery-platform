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
<<<<<<< HEAD
import { requireRoles } from '../middlewares/requirer-roles.middleware.js';
=======
import { requireRoles } from '../middlewares/require-roles.middleware.js';
>>>>>>> dd8136aa3b12121e9c5fff87a4506e2080245c11

const apiRouter = express.Router();

// TODO: 미들웨어 삽입 필요
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/stores', storeRouter);
apiRouter.use('/menu', menuRouter);
<<<<<<< HEAD
apiRouter.use('/carts', cartRouter);
=======
apiRouter.use('/carts', requireAccessToken, cartRouter);
>>>>>>> dd8136aa3b12121e9c5fff87a4506e2080245c11
apiRouter.use('/orders', requireAccessToken, orderRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/likes', requireAccessToken, requireRoles(['CUSTOMER']), likeRouter);
apiRouter.use('/transaction-logs', transactionLogRouter);

export { apiRouter };
