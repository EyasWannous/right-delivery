import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '@/infrastructure/database/mongoose/connection';
import { CaptainModel } from '@/infrastructure/database/mongoose/models/captain.model';
import { OrderModel } from '@/infrastructure/database/mongoose/models/order.model';
import { Captain } from '@/domain/captain/entities/captain.entity';
import { Order } from '@/domain/order/entities/order.entity';
import { CaptainStatus, CaptainAvailability } from '@/domain/captain/entities/captain.enums';
import { OrderStatus } from '@/domain/order/entities/order.enums';
import { CaptainMapper } from '@/infrastructure/database/mongoose/mappers/captain.mapper';
import { OrderMapper } from '@/infrastructure/database/mongoose/mappers/order.mapper';
import crypto from 'crypto';

async function seed() {
  console.log('Starting Database Seeder...');

  await connectDatabase();

  console.log('Clearing existing collections...');
  await CaptainModel.deleteMany({});
  await OrderModel.deleteMany({});

  console.log('Seeding Captains...');
  const captains = [
    Captain.create({
      id: crypto.randomUUID(),
      name: 'John Doe',
      phone: '+1234567890',
      vehicleType: 'motorcycle',
    }),
    Captain.create({
      id: crypto.randomUUID(),
      name: 'Jane Smith',
      phone: '+1987654321',
      vehicleType: 'car',
    }),

    Captain.create({
      id: crypto.randomUUID(),
      name: 'Mike Johnson',
      phone: '+1555555555',
      vehicleType: 'bicycle',
    }),

    Captain.create({
      id: crypto.randomUUID(),
      name: 'Sarah Williams',
      phone: '+1444444444',
      vehicleType: 'van',
    }),

    Captain.create({
      id: crypto.randomUUID(),
      name: 'David Brown',
      phone: '+1333333333',
      vehicleType: 'truck',
    }),
  ];

  captains[0].activate();
  captains[0].goOnline();

  captains[1].activate();
  captains[1].goOnline();

  captains[2].activate();

  captains[4].goOnline();

  await CaptainModel.insertMany(captains.map((c) => CaptainMapper.toPersistence(c)));

  console.log('Seeding Orders...');

  const activeOnlineCaptainId = captains[0].id;

  const orders = [
    Order.create({
      customerName: 'Alice Customer',
      customerPhone: '+1111111111',
      fullAddress: '123 Main St, Springfield',
      region: 'North',
      lat: 40.7128,
      lng: -74.006,
    }),
    Order.create({
      customerName: 'Bob Customer',
      customerPhone: '+1222222222',
      fullAddress: '456 Oak Ave, Springfield',
      region: 'North',
      lat: 40.7129,
      lng: -74.007,
    }),
    Order.create({
      customerName: 'Charlie Customer',
      customerPhone: '+1333333333',
      fullAddress: '789 Pine Rd, Springfield',
      region: 'South',
      lat: 40.713,
      lng: -74.008,
    }),

    Order.create({
      customerName: 'Dave Customer',
      customerPhone: '+1444444444',
      fullAddress: '321 Elm St, Springfield',
      region: 'East',
      lat: 40.7131,
      lng: -74.009,
    }),
    Order.create({
      customerName: 'Eve Customer',
      customerPhone: '+1555555555',
      fullAddress: '654 Birch Blvd, Springfield',
      region: 'West',
      lat: 40.7132,
      lng: -74.01,
    }),

    Order.create({
      customerName: 'Frank Customer',
      customerPhone: '+1666666666',
      fullAddress: '987 Cedar Ct, Springfield',
      region: 'Central',
      lat: 40.7133,
      lng: -74.011,
    }),
    Order.create({
      customerName: 'Grace Customer',
      customerPhone: '+1777777777',
      fullAddress: '147 Maple Dr, Springfield',
      region: 'Central',
      lat: 40.7134,
      lng: -74.012,
    }),

    Order.create({
      customerName: 'Heidi Customer',
      customerPhone: '+1888888888',
      fullAddress: '258 Walnut Way, Springfield',
      region: 'North',
      lat: 40.7135,
      lng: -74.013,
    }),
    Order.create({
      customerName: 'Ivan Customer',
      customerPhone: '+1999999999',
      fullAddress: '369 Ash Pl, Springfield',
      region: 'South',
      lat: 40.7136,
      lng: -74.014,
    }),

    Order.create({
      customerName: 'Judy Customer',
      customerPhone: '+1000000000',
      fullAddress: '753 Cherry Ln, Springfield',
      region: 'East',
      lat: 40.7137,
      lng: -74.015,
    }),
  ];

  orders[3].assign(activeOnlineCaptainId);
  orders[4].assign(activeOnlineCaptainId);

  orders[5].assign(activeOnlineCaptainId);
  orders[5].markPickedUp();

  orders[6].assign(activeOnlineCaptainId);
  orders[6].markPickedUp();

  orders[7].assign(activeOnlineCaptainId);
  orders[7].markPickedUp();
  orders[7].markDelivered();

  orders[8].assign(activeOnlineCaptainId);
  orders[8].markPickedUp();
  orders[8].markDelivered();

  orders[9].cancel();

  await OrderModel.insertMany(orders.map((o) => OrderMapper.toPersistence(o)));

  console.log('Seed completed successfully!');
  await disconnectDatabase();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
