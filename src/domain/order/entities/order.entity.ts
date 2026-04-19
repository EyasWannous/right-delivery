import { nanoid } from 'nanoid';
import { BusinessRuleError } from '@/domain/shared/errors';
import { Phone } from '@/domain/shared/value-objects/phone.value-object';
import { Location } from '@/domain/order/value-objects/location.value-object';
import { OrderStatus } from '@/domain/order/entities/order.enums';

export class Order {
  readonly id: string;
  readonly orderNumber: string;
  readonly customerName: string;
  readonly fullAddress: string;
  readonly region: string;
  readonly createdAt: Date;

  private readonly _customerPhone: Phone;
  private _location: Location;

  private _status: OrderStatus;
  private _captainId: string | null;
  private _externalReference: string | null;
  private _updatedAt: Date;

  private constructor(params: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: Phone;
    fullAddress: string;
    region: string;
    location: Location;
    status: OrderStatus;
    captainId: string | null;
    externalReference: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.orderNumber = params.orderNumber;
    this.customerName = params.customerName;
    this.fullAddress = params.fullAddress;
    this.region = params.region;
    this.createdAt = params.createdAt;
    this._customerPhone = params.customerPhone;
    this._location = params.location;
    this._status = params.status;
    this._captainId = params.captainId;
    this._externalReference = params.externalReference;
    this._updatedAt = params.updatedAt;
  }

  static create(params: {
    customerName: string;
    customerPhone: string;
    fullAddress: string;
    region: string;
    lat: number;
    lng: number;
    externalReference?: string | null;
  }): Order {
    const now = new Date();
    return new Order({
      id: crypto.randomUUID(),
      orderNumber: `ORD-${nanoid(8)}`,
      customerName: params.customerName,
      customerPhone: new Phone(params.customerPhone),
      fullAddress: params.fullAddress,
      region: params.region,
      location: new Location(params.lat, params.lng),
      status: OrderStatus.Created,
      captainId: null,
      externalReference: params.externalReference ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static reconstitute(params: {
    id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: Phone;
    fullAddress: string;
    region: string;
    location: Location;
    status: OrderStatus;
    captainId: string | null;
    externalReference: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Order {
    return new Order(params);
  }

  get customerPhone(): Phone {
    return this._customerPhone;
  }

  get location(): Location {
    return this._location;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get captainId(): string | null {
    return this._captainId;
  }

  get externalReference(): string | null {
    return this._externalReference;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isAssigned(): boolean {
    return this._captainId !== null;
  }

  isTerminal(): boolean {
    return this._status === OrderStatus.Delivered || this._status === OrderStatus.Cancelled;
  }

  assign(captainId: string): void {
    if (this.isTerminal()) {
      throw new BusinessRuleError(
        `Cannot assign captain to order "${this.orderNumber}" — order is ${this._status}.`,
      );
    }
    if (this.isAssigned()) {
      throw new BusinessRuleError(
        `Order "${this.orderNumber}" is already assigned to captain "${this._captainId}".`,
      );
    }
    this._captainId = captainId;
    this._status = OrderStatus.Assigned;
    this._touch();
  }

  unassign(): void {
    if (this.isTerminal()) {
      throw new BusinessRuleError(
        `Cannot unassign captain from order "${this.orderNumber}" — order is ${this._status}.`,
      );
    }
    if (!this.isAssigned()) {
      throw new BusinessRuleError(`Order "${this.orderNumber}" has no captain assigned.`);
    }
    this._captainId = null;
    this._status = OrderStatus.Created;
    this._touch();
  }

  markPickedUp(): void {
    if (this._status !== OrderStatus.Assigned) {
      throw new BusinessRuleError(
        `Cannot mark order "${this.orderNumber}" as picked up — current status is ${this._status}. Order must be Assigned first.`,
      );
    }
    this._status = OrderStatus.PickedUp;
    this._touch();
  }

  markDelivered(): void {
    if (this._status !== OrderStatus.PickedUp) {
      throw new BusinessRuleError(
        `Cannot mark order "${this.orderNumber}" as delivered — current status is ${this._status}. Order must be PickedUp first.`,
      );
    }
    this._status = OrderStatus.Delivered;
    this._touch();
  }

  cancel(): void {
    if (this._status === OrderStatus.Delivered) {
      throw new BusinessRuleError(
        `Cannot cancel order "${this.orderNumber}" — it has already been delivered.`,
      );
    }
    this._status = OrderStatus.Cancelled;
    this._touch();
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
