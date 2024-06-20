import express from 'express';
import { transactionLogController } from '../di/dependency-injected-instances.js';
import { requireRoles } from '../middlewares/require-roles.middleware.js';

const transactionLogRouter = express.Router();

// 거래 로그 조회 API
transactionLogRouter.get('/', requireRoles(['ADMIN']), transactionLogController.getAllLogs);

export { transactionLogRouter };
