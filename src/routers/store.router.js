import express from 'express';
import { prisma } from '../utils/prisma.util';
import { StoreRepository } from '../repositories/store.repository.js';
import { StoreService } from '../services/store.service.js';
import { StoreController } from '../controllers/store.controller.js';

const storeRouter = express.Router();

const storeRepository = new StoreRepository(prisma);
const storeService = new StoreService(storeRepository);
const storeController = new StoreController(storeService);

// 가게 등록 API

// 가게 목록 조회 API

// 가게 상세 조회 API

// 가게 정보 수정 API

// 가게 정보 삭제 API

export { storeRouter };
