import express from 'express';
import { authRouter } from './auth.router.js';
import { userRouter } from './user.router.js';
import { storeRouter } from './store.router.js';
import { orderRouter } from './order.router.js';
import { menuRouter } from './menu.router.js';
import { reviewRouter } from './review.router.js';
import { likeRouter } from './like.router.js';
import { cartRouter } from './cart.router.js';
// import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';
// import { requireRoles } from '../middlewares/require-roles.middleware.js';

const apiRouter = express.Router();

// TODO: 미들웨어 삽입 필요
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/stores', storeRouter);
apiRouter.use('/orders', orderRouter);
apiRouter.use('/menu', menuRouter);
apiRouter.use('/reviews', reviewRouter);
apiRouter.use('/likes', likeRouter);
apiRouter.use('/carts', cartRouter);

export { apiRouter };
