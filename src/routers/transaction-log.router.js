import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { TransactionLogRepository } from '../repositories/transaction-log.repository.js';
import { TransactionLogService } from '../services/transaction-log.service.js';
import { TransactionLogController } from '../controllers/transaction-log.controller.js';

const transactionLogRouter = express.Router();

const transactionLogRepository = new TransactionLogRepository(prisma);
const transactionLogService = new TransactionLogService(transactionLogRepository);
const transactionLogController = new TransactionLogController(transactionLogService);

// 거래 로그 등록 API

// 거래 로그 조회 API

export { transactionLogRouter };
