class TransactionLogRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create = async (senderId, receiverId, amount, type, { tx } = {}) => {
    const orm = tx || this.prisma;
    const transactionLog = await orm.transactionLog.create({
      data: { senderId, receiverId, amount, type },
    });
    return transactionLog;
  };

  findAll = async () => {
    const logs = await this.prisma.transactionLog.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return logs;
  };
}

export default TransactionLogRepository;
