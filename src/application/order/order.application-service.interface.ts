import { OrderStatus } from '@/domain/order/entities/order.enums';
import { OrderDto } from '@/application/order/dtos/order.dto';

export const IOrderApplicationService = Symbol('IOrderApplicationService');

export interface IOrderApplicationService {
  createOrder(params: {
    customerName: string;
    customerPhone: string;
    fullAddress: string;
    region: string;
    lat: number;
    lng: number;
    externalReference?: string;
  }): Promise<OrderDto>;

  getOrder(id: string): Promise<OrderDto>;

  listOrders(filters: {
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
  }): Promise<{ orders: OrderDto[]; total: number; page: number; limit: number }>;

  updateOrder(params: {
    id: string;
    customerName?: string;
    fullAddress?: string;
    region?: string;
    lat?: number;
    lng?: number;
  }): Promise<OrderDto>;

  deleteOrder(id: string): Promise<void>;

  assignCaptain(params: { orderId: string; captainId: string }): Promise<OrderDto>;

  unassignCaptain(orderId: string): Promise<OrderDto>;

  updateOrderStatus(params: {
    orderId: string;
    action: 'mark_picked_up' | 'mark_delivered';
  }): Promise<OrderDto>;

  cancelOrder(orderId: string): Promise<OrderDto>;
}
