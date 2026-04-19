import { inject, injectable } from 'tsyringe';
import { Order } from '@/domain/order/entities/order.entity';
import { Location } from '@/domain/order/value-objects/location.value-object';
import { IOrderRepository } from '@/domain/order/repositories/order.repository.interface';
import { OrderStatus } from '@/domain/order/entities/order.enums';
import { BusinessRuleError, NotFoundError, ValidationError } from '@/domain/shared/errors';

@injectable()
export class OrderDomainService {
  constructor(
    @inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  private async getOrderOrThrow(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order', orderId);
    }
    return order;
  }

  async createOrder(params: {
    customerName: string;
    customerPhone: string;
    fullAddress: string;
    region: string;
    lat: number;
    lng: number;
    externalReference?: string;
  }): Promise<Order> {
    const order = Order.create(params);
    await this.orderRepository.save(order);
    return order;
  }

  async updateOrder(params: {
    id: string;
    customerName?: string;
    fullAddress?: string;
    region?: string;
    lat?: number;
    lng?: number;
  }): Promise<Order> {
    const existing = await this.getOrderOrThrow(params.id);

    if (existing.isTerminal()) {
      throw new BusinessRuleError('Cannot update a delivered or cancelled order.');
    }

    const hasLat = params.lat !== undefined;
    const hasLng = params.lng !== undefined;
    if (hasLat !== hasLng) {
      throw new ValidationError(
        'Both lat and lng must be provided together to update the order location.',
      );
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
    return updated;
  }

  async assignCaptain(orderId: string, captainId: string): Promise<Order> {
    const order = await this.getOrderOrThrow(orderId);
    order.assign(captainId);
    await this.orderRepository.save(order);
    return order;
  }

  async unassignCaptain(orderId: string): Promise<Order> {
    const order = await this.getOrderOrThrow(orderId);
    order.unassign();
    await this.orderRepository.save(order);
    return order;
  }

  async markPickedUp(orderId: string): Promise<Order> {
    const order = await this.getOrderOrThrow(orderId);
    order.markPickedUp();
    await this.orderRepository.save(order);
    return order;
  }

  async markDelivered(orderId: string): Promise<Order> {
    const order = await this.getOrderOrThrow(orderId);
    order.markDelivered();
    await this.orderRepository.save(order);
    return order;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.getOrderOrThrow(orderId);
    order.cancel();
    await this.orderRepository.save(order);
    return order;
  }

  async deleteOrder(orderId: string): Promise<void> {
    const order = await this.getOrderOrThrow(orderId);

    const isDeletable =
      order.status !== OrderStatus.Assigned && order.status !== OrderStatus.PickedUp;

    if (!isDeletable) {
      throw new BusinessRuleError(
        `Cannot delete order "${order.orderNumber}" — it is currently ${order.status}. ` +
          `Unassign or cancel the order before deleting.`,
      );
    }

    await this.orderRepository.delete(orderId);
  }
}
