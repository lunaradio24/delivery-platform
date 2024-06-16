import 'dotenv/config';
import express from 'express';
import { SERVER_PORT } from './constants/env.constant.js';
import { HTTP_STATUS } from './constants/http-status.constant.js';
import { apiRouter } from './routers/index.js';
import logger from './middlewares/logger.middleware.js';
import errorHandler from './middlewares/error-handler.middleware.js';

const app = express();

app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health-check', (req, res) => {
  return res.status(HTTP_STATUS.OK).send('I am healthy!');
});

app.use('/api', apiRouter);
app.use(errorHandler);

app.listen(SERVER_PORT, () => {
  console.log(`서버가 ${SERVER_PORT}번 포트에서 실행중입니다.`);
});
