import { Order } from '@/domain/order/entities/order.entity';
import { OrderStatus } from '@/domain/order/entities/order.enums';

export const IOrderRepository = Symbol('IOrderRepository');

export interface OrderFilters {
  status?: OrderStatus;

  region?: string;

  captainId?: string;

  assignmentState?: 'assigned' | 'unassigned';

  dateFrom?: Date;

  dateTo?: Date;

  search?: string;

  sortBy?: 'createdAt' | 'updatedAt' | 'status';

  sortOrder?: 'asc' | 'desc';

  page?: number;

  limit?: number;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
}

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;

  findByOrderNumber(orderNumber: string): Promise<Order | null>;

  findByExternalReference(ref: string): Promise<Order | null>;

  findAll(filters: OrderFilters): Promise<PaginatedOrders>;

  save(order: Order): Promise<void>;

  delete(id: string): Promise<void>;
}
