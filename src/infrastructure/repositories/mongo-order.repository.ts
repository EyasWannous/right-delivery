import { injectable } from 'tsyringe';
import { Order } from '@/domain/order/entities/order.entity';
import {
  IOrderRepository,
  OrderFilters,
} from '../../domain/order/repositories/order.repository.interface';
import { OrderModel } from '@/infrastructure/database/mongoose/models/order.model';
import { OrderMapper } from '@/infrastructure/database/mongoose/mappers/order.mapper';

@injectable()
export class MongoOrderRepository implements IOrderRepository {
  async findById(id: string): Promise<Order | null> {
    const doc = await OrderModel.findById(id).lean().exec();
    if (!doc) return null;
    return OrderMapper.toDomain(doc as any);
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const doc = await OrderModel.findOne({ orderNumber }).lean().exec();
    if (!doc) return null;
    return OrderMapper.toDomain(doc as any);
  }

  async findByExternalReference(ref: string): Promise<Order | null> {
    const doc = await OrderModel.findOne({ externalReference: ref }).lean().exec();
    if (!doc) return null;
    return OrderMapper.toDomain(doc as any);
  }

  async findAll(filters: OrderFilters): Promise<{ orders: Order[]; total: number }> {
    const query: Record<string, any> = {};

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.region) {
      query.region = filters.region;
    }
    if (filters.captainId) {
      query.captainId = filters.captainId;
    }

    if (filters.assignmentState === 'assigned') {
      query.captainId = { $ne: null };
    } else if (filters.assignmentState === 'unassigned') {
      query.captainId = null;
    }

    if (filters.dateFrom || filters.dateTo) {
      query.createdAt = {};
      if (filters.dateFrom) {
        query.createdAt.$gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        query.createdAt.$lte = filters.dateTo;
      }
    }

    const sort: Record<string, 1 | -1> = {};
    if (filters.sortBy) {
      const direction = filters.sortOrder === 'asc' ? 1 : -1;
      sort[filters.sortBy] = direction;
    } else {
      sort.createdAt = -1;
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      OrderModel.find(query).sort(sort).skip(skip).limit(limit).lean().exec(),
      OrderModel.countDocuments(query).exec(),
    ]);

    return {
      orders: docs.map((doc) => OrderMapper.toDomain(doc as any)),
      total,
    };
  }

  async save(order: Order): Promise<void> {
    await OrderModel.findByIdAndUpdate(
      order.id,
      { $set: OrderMapper.toPersistence(order) },
      { upsert: true, new: true },
    ).exec();
  }

  async delete(id: string): Promise<void> {
    await OrderModel.findByIdAndDelete(id).exec();
  }
}
