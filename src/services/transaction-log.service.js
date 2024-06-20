class TransactionLogService {
  constructor(transactionLogRepository) {
    this.transactionLogRepository = transactionLogRepository;
  }

  getAllLogs = async () => {
    const logs = await this.transactionLogRepository.findAll();
    return logs;
  };
}

export default TransactionLogService;
