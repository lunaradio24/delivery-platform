class TransactionLogRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  create = async (senderId, receiverId, amount, type) => {
    await this.prisma.transactionLog.create({
      data: { senderId, receiverId, amount, type },
    });
  };
}

export default TransactionLogRepository;
