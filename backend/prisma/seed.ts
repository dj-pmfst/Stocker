import {
  PrismaClient,
  Role,
  UnitOfMeasure,
  AlertType,
  Shift,
} from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  console.log('Seeding database...');

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log('Database already seeded — skipping.');
    return;
  }

  const adminPassword = await hash(
    process.env.SEED_ADMIN_PASSWORD ?? 'Admin1234!',
    12,
  );
  const userPassword = await hash(
    process.env.SEED_USER_PASSWORD ?? 'User1234!',
    12,
  );

  const [alice, bob, carol] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        firstName: 'Alice',
        lastName: 'Rossi',
        email: 'alice@example.com',
        password: adminPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        firstName: 'Bob',
        lastName: 'Marini',
        email: 'bob@example.com',
        password: userPassword,
      },
    }),
    prisma.user.upsert({
      where: { email: 'carol@example.com' },
      update: {},
      create: {
        firstName: 'Carol',
        lastName: 'Bianchi',
        email: 'carol@example.com',
        password: userPassword,
      },
    }),
  ]);
  console.log('Users created');

  const [warehouseA, warehouseB] = await Promise.all([
    prisma.warehouse.create({
      data: { name: 'Main Warehouse', address: 'Via Roma 1, Milano' },
    }),
    prisma.warehouse.create({
      data: { name: 'North Depot', address: 'Via Garibaldi 22, Torino' },
    }),
  ]);
  console.log('Warehouses created');

  await prisma.userWarehouse.createMany({
    skipDuplicates: true,
    data: [
      { userId: alice.id, warehouseId: warehouseA.id, role: Role.ADMIN },
      {
        userId: bob.id,
        warehouseId: warehouseA.id,
        role: Role.WAREHOUSE_MANAGER,
      },
      { userId: carol.id, warehouseId: warehouseA.id, role: Role.WAITER },
      { userId: alice.id, warehouseId: warehouseB.id, role: Role.ADMIN },
      { userId: carol.id, warehouseId: warehouseB.id, role: Role.WAITER },
    ],
  });
  console.log('UserWarehouses created');

  const defaultProductDefs = [
    {
      name: 'Sprite',
      category: 'Drink',
      unitOfMeasure: UnitOfMeasure.L,
    },
    { name: 'Milk', category: 'Drink', unitOfMeasure: UnitOfMeasure.L },
    {
      name: 'Espresso beans',
      category: 'Dry goods',
      unitOfMeasure: UnitOfMeasure.KG,
    },
    {
      name: 'Mineral Water',
      category: 'Drink',
      unitOfMeasure: UnitOfMeasure.L,
    },
    { name: 'Sugar', category: 'Dry Goods', unitOfMeasure: UnitOfMeasure.KG },
    {
      name: 'Coca-Cola',
      category: 'Drink',
      unitOfMeasure: UnitOfMeasure.L,
    },
  ];

  const defaultProducts = await Promise.all(
    defaultProductDefs.map((def) =>
      prisma.defaultProduct.create({ data: def }),
    ),
  );
  console.log('DefaultProducts created');

  const minimumQtyA = [10, 50, 100, 200, 30, 20];
  const minimumQtyB = [5, 25, 50];

  const [productsA, productsB] = await Promise.all([
    Promise.all(
      defaultProducts.map((dp, i) =>
        prisma.product.upsert({
          where: {
            defaultProductId_warehouseId: {
              defaultProductId: dp.id,
              warehouseId: warehouseA.id,
            },
          },
          update: {},
          create: {
            defaultProductId: dp.id,
            warehouseId: warehouseA.id,
            minimumQuantity: minimumQtyA[i],
          },
        }),
      ),
    ),
    Promise.all(
      defaultProducts.slice(0, 3).map((dp, i) =>
        prisma.product.upsert({
          where: {
            defaultProductId_warehouseId: {
              defaultProductId: dp.id,
              warehouseId: warehouseB.id,
            },
          },
          update: {},
          create: {
            defaultProductId: dp.id,
            warehouseId: warehouseB.id,
            minimumQuantity: minimumQtyB[i],
          },
        }),
      ),
    ),
  ]);
  console.log('Products created');

  const stockDataA = [120, 80, 200, 500, 60, 15];
  const stockDataB = [8, 30, 40];

  await Promise.all([
    ...productsA.map((p, i) =>
      prisma.productStock.upsert({
        where: { productId: p.id },
        update: {},
        create: { productId: p.id, quantity: stockDataA[i] },
      }),
    ),
    ...productsB.map((p, i) =>
      prisma.productStock.upsert({
        where: { productId: p.id },
        update: {},
        create: { productId: p.id, quantity: stockDataB[i] },
      }),
    ),
  ]);
  console.log('ProductStock created');

  const zones = ['A', 'B', 'C'];

  await Promise.all([
    ...productsA.map((p, i) =>
      prisma.location.upsert({
        where: { productId: p.id },
        update: {},
        create: { productId: p.id, zone: zones[i % 3], shelf: `${i + 1}` },
      }),
    ),
    ...productsB.map((p, i) =>
      prisma.location.upsert({
        where: { productId: p.id },
        update: {},
        create: { productId: p.id, zone: zones[i % 3], shelf: `${i + 1}` },
      }),
    ),
  ]);
  console.log('Locations created');

  await prisma.alert.createMany({
    skipDuplicates: true,
    data: [
      {
        productId: productsA[5].id,
        type: AlertType.RED,
        message: 'Stock below minimum quantity. Reorder immediately.',
        date: daysAgo(1),
      },
      {
        productId: productsA[4].id,
        type: AlertType.YELLOW,
        message: 'Stock approaching minimum quantity.',
        date: daysAgo(2),
      },
      {
        productId: productsB[0].id,
        type: AlertType.YELLOW,
        message: 'Low stock detected at North Depot.',
        date: daysAgo(3),
      },
    ],
  });
  console.log('Alerts created');

  await prisma.saleEntry.create({
    data: {
      warehouseId: warehouseA.id,
      userId: carol.id,
      shift: Shift.MORNING,
      note: 'Regular morning shift sales',
      date: daysAgo(7),
      items: {
        create: [
          { productId: productsA[0].id, quantity: 5, price: 8.5 },
          { productId: productsA[2].id, quantity: 20, price: 1.2 },
          { productId: productsA[3].id, quantity: 50, price: 0.5 },
        ],
      },
    },
  });

  await prisma.saleEntry.create({
    data: {
      warehouseId: warehouseA.id,
      userId: bob.id,
      shift: Shift.AFTERNOON,
      date: daysAgo(5),
      items: {
        create: [
          { productId: productsA[1].id, quantity: 10, price: 1.8 },
          { productId: productsA[5].id, quantity: 3, price: 12.0 },
        ],
      },
    },
  });
  console.log('SaleEntries created');

  await prisma.deliveryEntry.create({
    data: {
      warehouseId: warehouseA.id,
      userId: bob.id,
      shift: Shift.MORNING,
      note: 'Weekly restock from supplier',
      date: daysAgo(10),
      items: {
        create: [
          { productId: productsA[0].id, quantity: 50, price: 7.0 },
          { productId: productsA[1].id, quantity: 100, price: 1.5 },
          { productId: productsA[4].id, quantity: 80, price: 0.9 },
          { productId: productsA[5].id, quantity: 20, price: 10.0 },
        ],
      },
    },
  });

  await prisma.deliveryEntry.create({
    data: {
      warehouseId: warehouseB.id,
      userId: carol.id,
      shift: Shift.AFTERNOON,
      date: daysAgo(8),
      items: {
        create: [
          { productId: productsB[0].id, quantity: 20, price: 7.5 },
          { productId: productsB[2].id, quantity: 60, price: 1.1 },
        ],
      },
    },
  });
  console.log('DeliveryEntries created');

  console.log('\nSeed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
