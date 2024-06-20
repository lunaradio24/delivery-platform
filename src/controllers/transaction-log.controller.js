import { HTTP_STATUS } from '../constants/http-status.constant.js';
import { MESSAGES } from '../constants/message.constant.js';

class TransactionLogController {
  constructor(transactionLogService) {
    this.transactionLogService = transactionLogService;
  }

  getAllLogs = async (req, res, next) => {
    try {
      const logs = await this.transactionLogService.getAllLogs();
      return res.status(HTTP_STATUS.OK).json({
        status: HTTP_STATUS.OK,
        message: MESSAGES.TRANSACTION_LOGS.READ_LIST.SUCCEED,
        data: logs,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default TransactionLogController;
