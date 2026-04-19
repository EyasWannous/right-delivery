import { Order } from '@/domain/order/entities/order.entity';
import { OrderStatus } from '@/domain/order/entities/order.enums';
import { Phone } from '@/domain/shared/value-objects/phone.value-object';
import { Location } from '@/domain/order/value-objects/location.value-object';
import { OrderDocument } from '@/infrastructure/database/mongoose/models/order.model';

export class OrderMapper {
  static toDomain(doc: OrderDocument): Order {
    return Order.reconstitute({
      id: doc._id as string,
      orderNumber: doc.orderNumber,
      customerName: doc.customerName,
      customerPhone: new Phone(doc.customerPhone),
      fullAddress: doc.fullAddress,
      region: doc.region,
      location: new Location(doc.location.lat, doc.location.lng),
      status: doc.status as OrderStatus,
      captainId: doc.captainId ?? null,
      externalReference: doc.externalReference ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(order: Order): Record<string, unknown> {
    return {
      _id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone.value,
      fullAddress: order.fullAddress,
      region: order.region,
      location: {
        lat: order.location.lat,
        lng: order.location.lng,
      },
      status: order.status,
      captainId: order.captainId ?? undefined,
      externalReference: order.externalReference ?? undefined,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
