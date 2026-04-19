import { inject, injectable } from 'tsyringe';
import { Order } from '@/domain/order/entities/order.entity';
import { Location } from '@/domain/order/value-objects/location.value-object';
import { OrderStatus } from '@/domain/order/entities/order.enums';
import { OrderDomainService } from '@/domain/order/order.domain-service';
import { IOrderRepository } from '@/domain/order/repositories/order.repository.interface';
import { ICaptainRepository } from '@/domain/captain/repositories/captain.repository.interface';
import { BusinessRuleError, NotFoundError, ValidationError } from '@/domain/shared/errors';
import { OrderDto, toOrderDto } from '@/application/order/dtos/order.dto';
import { IOrderApplicationService } from '@/application/order/order.application-service.interface';

@injectable()
export class OrderApplicationService implements IOrderApplicationService {
  constructor(
    @inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    @inject(OrderDomainService)
    private readonly orderDomainService: OrderDomainService,
    @inject(ICaptainRepository)
    private readonly captainRepository: ICaptainRepository,
  ) {}

  async createOrder(params: {
    customerName: string;
    customerPhone: string;
    fullAddress: string;
    region: string;
    lat: number;
    lng: number;
    externalReference?: string;
  }): Promise<OrderDto> {
    const order = await this.orderDomainService.createOrder(params);
    return toOrderDto(order);
  }

  async getOrder(id: string): Promise<OrderDto> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }
    return toOrderDto(order);
  }

  async listOrders(filters: {
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
  }): Promise<{ orders: OrderDto[]; total: number; page: number; limit: number }> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const { orders, total } = await this.orderRepository.findAll({
      ...filters,
      page,
      limit,
    });

    return { orders: orders.map(toOrderDto), total, page, limit };
  }

  async updateOrder(params: {
    id: string;
    customerName?: string;
    fullAddress?: string;
    region?: string;
    lat?: number;
    lng?: number;
  }): Promise<OrderDto> {
    const existing = await this.orderRepository.findById(params.id);
    if (!existing) {
      throw new NotFoundError('Order', params.id);
    }

    if (existing.isTerminal()) {
      throw new BusinessRuleError('Cannot update a delivered or cancelled order.');
    }

    const hasLat = params.lat !== undefined;
    const hasLng = params.lng !== undefined;
    if (hasLat !== hasLng) {
      throw new ValidationError('Both lat and lng must be provided together.');
    }

    const newLocation =
      hasLat && hasLng
        ? new Location(params.lat as number, params.lng as number)
        : existing.location;

    const updated = Order.reconstitute({
      id: existing.id,
      orderNumber: existing.orderNumber,
      customerName: params.customerName ?? existing.customerName,
      customerPhone: existing.customerPhone,
      fullAddress: params.fullAddress ?? existing.fullAddress,
      region: params.region ?? existing.region,
      location: newLocation,
      status: existing.status,
      captainId: existing.captainId,
      externalReference: existing.externalReference,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.orderRepository.save(updated);
    return toOrderDto(updated);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.orderDomainService.deleteOrder(id);
  }

  async assignCaptain(params: { orderId: string; captainId: string }): Promise<OrderDto> {
    const captain = await this.captainRepository.findById(params.captainId);
    if (!captain) {
      throw new NotFoundError('Captain', params.captainId);
    }

    if (!captain.canBeAssigned()) {
      throw new BusinessRuleError(
        `Captain "${params.captainId}" cannot be assigned — must be active and online.`,
      );
    }

    const order = await this.orderDomainService.assignCaptain(params.orderId, params.captainId);
    return toOrderDto(order);
  }

  async unassignCaptain(orderId: string): Promise<OrderDto> {
    const order = await this.orderDomainService.unassignCaptain(orderId);
    return toOrderDto(order);
  }

  async updateOrderStatus(params: {
    orderId: string;
    action: 'mark_picked_up' | 'mark_delivered';
  }): Promise<OrderDto> {
    let order;

    switch (params.action) {
      case 'mark_picked_up':
        order = await this.orderDomainService.markPickedUp(params.orderId);
        break;

      case 'mark_delivered':
        order = await this.orderDomainService.markDelivered(params.orderId);
        break;

      default: {
        const _exhaustive: never = params.action;
        throw new Error(`Unhandled order status action: ${String(_exhaustive)}`);
      }
    }

    return toOrderDto(order);
  }

  async cancelOrder(orderId: string): Promise<OrderDto> {
    const order = await this.orderDomainService.cancelOrder(orderId);
    return toOrderDto(order);
  }
}
