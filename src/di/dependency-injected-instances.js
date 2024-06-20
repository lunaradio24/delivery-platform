import { prisma } from '../utils/prisma.util.js';

// repository constructors
import AuthRepository from '../repositories/auth.repository.js';
import UserRepository from '../repositories/user.repository.js';
import StoreRepository from '../repositories/store.repository.js';
import MenuRepository from '../repositories/menu.repository.js';
import CartRepository from '../repositories/cart-Item.repository.js';
import OrderRepository from '../repositories/order.repository.js';
import OrderItemRepository from '../repositories/order-item.repository.js';
import ReviewRepository from '../repositories/review.repository.js';
import LikeRepository from '../repositories/like.repository.js';
import TransactionLogRepository from '../repositories/transaction-log.repository.js';

// service constructors
import AuthService from '../services/auth.service.js';
import UserService from '../services/user.service.js';
import StoreService from '../services/store.service.js';
import MenuService from '../services/menu.service.js';
import CartService from '../services/cart.service.js';
import OrderService from '../services/order.service.js';
import ReviewService from '../services/review.service.js';
import LikeService from '../controllers/like.controller.js';
import TransactionLogService from '../services/transaction-log.service.js';

// controller constructors
import AuthController from '../controllers/auth.controller.js';
import UserController from '../controllers/user.controller.js';
import StoreController from '../controllers/store.controller.js';
import MenuController from '../controllers/menu.controller.js';
import CartController from '../controllers/cart.controller.js';
import OrderController from '../controllers/order.controller.js';
import ReviewController from '../controllers/review.controller.js';
import LikeController from '../controllers/like.controller.js';
import TransactionLogController from '../controllers/transaction-log.controller.js';

// repository instances
export const authRepository = new AuthRepository(prisma);
export const userRepository = new UserRepository(prisma);
export const storeRepository = new StoreRepository(prisma);
export const menuRepository = new MenuRepository(prisma);
export const cartRepository = new CartRepository(prisma);
export const orderRepository = new OrderRepository(prisma);
export const orderItemRepository = new OrderItemRepository(prisma);
export const reviewRepository = new ReviewRepository(prisma);
export const likeRepository = new LikeRepository(prisma);
export const transactionLogRepository = new TransactionLogRepository(prisma);

// service instances
export const authService = new AuthService(authRepository, userRepository, transactionLogRepository);
export const userService = new UserService(userRepository);
export const storeService = new StoreService(storeRepository);
export const menuService = new MenuService(menuRepository);
export const cartService = new CartService(cartRepository);
export const orderService = new OrderService(orderRepository, menuRepository, userRepository, transactionLogRepository);
export const reviewService = new ReviewService(
  reviewRepository,
  orderRepository,
  orderItemRepository,
  storeRepository,
  menuRepository,
);
export const likeService = new LikeService(likeRepository);
export const transactionLogService = new TransactionLogService(transactionLogRepository);

// controller instances
export const authController = new AuthController(authService);
export const userController = new UserController(userService);
export const storeController = new StoreController(storeService, storeRepository);
export const menuController = new MenuController(menuService, menuRepository);
export const cartController = new CartController(cartService);
export const orderController = new OrderController(orderService);
export const reviewController = new ReviewController(reviewService);
export const likeController = new LikeController(likeService);
export const transactionLogController = new TransactionLogController(transactionLogService);
