import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      return prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
          nickname: faker.internet.userName(),
          contactNumber: faker.phone.number(),
          address: faker.address.streetAddress(),
          image: faker.image.avatar(),
          socialId: faker.datatype.number({ min: 1, max: 1000000 }),
          provider: faker.datatype.number({ min: 1, max: 4 }),
        },
      });
    }),
  );

  // Create Stores
  const stores = await Promise.all(
    Array.from({ length: 5 }).map((_, index) => {
      return prisma.store.create({
        data: {
          ownerId: users[index].id,
          name: faker.company.name(),
          address: faker.address.streetAddress(),
          contactNumber: parseInt(faker.phone.number().replace(/\D/g, '')),
          category: faker.datatype.number({ min: 1, max: 20 }),
          openingHours: '9:00 AM - 9:00 PM',
          image: faker.image.business(),
        },
      });
    }),
  );

  // Create Menus
  const menus = await Promise.all(
    stores.flatMap((store) =>
      Array.from({ length: 3 }).map(() => {
        return prisma.menu.create({
          data: {
            storeId: store.id,
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.datatype.number({ min: 100000, max: 700000 }),
            image: faker.image.food(),
          },
        });
      }),
    ),
  );

  // Create CartItems
  const cartItems = await Promise.all(
    users.flatMap((user) =>
      stores.map((store) => {
        const menu = menus.find((menu) => menu.storeId === store.id);
        return prisma.cartItem.create({
          data: {
            customerId: user.id,
            storeId: store.id,
            menuId: menu?.id || 0,
            quantity: faker.datatype.number({ min: 1, max: 5 }),
          },
        });
      }),
    ),
  );

  // Create Orders
  const orders = await Promise.all(
    users.flatMap((user) =>
      stores.map((store) => {
        return prisma.order.create({
          data: {
            customerId: user.id,
            storeId: store.id,
            totalPrice: faker.datatype.number({ min: 100, max: 1000 }) * 1000,
          },
        });
      }),
    ),
  );

  // Create OrderItems
  const orderItems = await Promise.all(
    orders.flatMap((order) => {
      const store = stores.find((store) => store.id === order.storeId);
      const menu = menus.find((menu) => menu.storeId === store?.id);
      return prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuId: menu?.id || 0,
          quantity: faker.datatype.number({ min: 1, max: 5 }),
        },
      });
    }),
  );

  // Create Reviews
  const reviews = await Promise.all(
    orders.map((order) => {
      return prisma.review.create({
        data: {
          customerId: order.customerId,
          storeId: order.storeId,
          orderId: order.id,
          rating: faker.datatype.number({ min: 1, max: 5 }),
          content: faker.lorem.sentence(),
          image: faker.image.imageUrl(),
        },
      });
    }),
  );

  // Create Likes
  const likes = await Promise.all(
    users.flatMap((user) =>
      stores.map((store) => {
        return prisma.like.create({
          data: {
            customerId: user.id,
            storeId: store.id,
          },
        });
      }),
    ),
  );

  // Create TransactionLogs
  const transactionLogs = [];
  users.forEach((user) => {
    users.forEach((receiver) => {
      if (user.id !== receiver.id) {
        transactionLogs.push(
          prisma.transactionLog.create({
            data: {
              senderId: user.id,
              receiverId: receiver.id,
              amount: faker.datatype.number({ min: 100, max: 10000 }) * 1000,
              type: faker.datatype.boolean(),
            },
          }),
        );
      }
    });
  });
  await Promise.all(transactionLogs);

  // Create Notifications
  const notifications = await Promise.all(
    users.map((user) => {
      return prisma.notification.create({
        data: {
          userId: user.id,
          content: faker.lorem.sentence(),
          isRead: faker.datatype.boolean(),
        },
      });
    }),
  );

  console.log('Dummy data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
