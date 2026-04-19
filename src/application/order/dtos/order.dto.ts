import { Order } from '@/domain/order/entities/order.entity';

export interface OrderDto {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  fullAddress: string;
  region: string;
  location: { lat: number; lng: number };
  status: string;
  captainId: string | null;
  externalReference: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toOrderDto(order: Order): OrderDto {
  return {
    id: order.id,
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
    captainId: order.captainId,
    externalReference: order.externalReference,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
