import { HttpError } from '../errors/http.error.js';
import { MESSAGES } from '../constants/message.constant.js';

class TransactionLogService {
  constructor(transactionLogRepository) {
    this.transactionLogRepository = transactionLogRepository;
  }
  // method 작성해주시면 됩니다.
}

export default TransactionLogService;
