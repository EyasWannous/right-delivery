import { BusinessRuleError } from '@/domain/shared/errors';
import { CaptainAvailability, CaptainStatus } from '@/domain/captain/entities/captain.enums';
import { CurrentLocation } from '@/domain/captain/value-objects/current-location.value-object';
import { Phone } from '@/domain/shared/value-objects/phone.value-object';

export class Captain {
  readonly id: string;
  readonly name: string;
  readonly vehicleType: string;
  readonly createdAt: Date;

  private _phone: Phone;
  private _currentLocation: CurrentLocation | null;

  private _status: CaptainStatus;
  private _availability: CaptainAvailability;

  private _updatedAt: Date;

  private constructor(params: {
    id: string;
    name: string;
    phone: Phone;
    vehicleType: string;
    status: CaptainStatus;
    availability: CaptainAvailability;
    currentLocation: CurrentLocation | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.vehicleType = params.vehicleType;
    this.createdAt = params.createdAt;
    this._phone = params.phone;
    this._currentLocation = params.currentLocation;
    this._status = params.status;
    this._availability = params.availability;
    this._updatedAt = params.updatedAt;
  }

  static create(params: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
    status?: CaptainStatus;
    availability?: CaptainAvailability;
    currentLocation?: { lat: number; lng: number; updatedAt?: Date } | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Captain {
    const phone = new Phone(params.phone);

    const currentLocation =
      params.currentLocation != null
        ? new CurrentLocation(
            params.currentLocation.lat,
            params.currentLocation.lng,
            params.currentLocation.updatedAt,
          )
        : null;

    return new Captain({
      id: params.id,
      name: params.name,
      vehicleType: params.vehicleType,
      phone,
      status: params.status ?? CaptainStatus.Inactive,
      availability: params.availability ?? CaptainAvailability.Offline,
      currentLocation,
      createdAt: params.createdAt ?? new Date(),
      updatedAt: params.updatedAt ?? new Date(),
    });
  }

  static reconstitute(params: {
    id: string;
    name: string;
    phone: Phone;
    vehicleType: string;
    status: CaptainStatus;
    availability: CaptainAvailability;
    currentLocation: CurrentLocation | null;
    createdAt: Date;
    updatedAt: Date;
  }): Captain {
    return new Captain(params);
  }

  get phone(): Phone {
    return this._phone;
  }

  get currentLocation(): CurrentLocation | null {
    return this._currentLocation;
  }

  get status(): CaptainStatus {
    return this._status;
  }

  get availability(): CaptainAvailability {
    return this._availability;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  isActive(): boolean {
    return this._status === CaptainStatus.Active;
  }

  isOnline(): boolean {
    return this._availability === CaptainAvailability.Online;
  }

  canBeAssigned(): boolean {
    return this.isActive() && this.isOnline();
  }

  activate(): void {
    this._status = CaptainStatus.Active;
    this._touch();
  }

  deactivate(): void {
    this._status = CaptainStatus.Inactive;
    this._touch();
  }

  goOnline(): void {
    this._availability = CaptainAvailability.Online;
    this._touch();
  }

  goOffline(): void {
    this._availability = CaptainAvailability.Offline;
    this._touch();
  }

  updateLocation(lat: number, lng: number): void {
    if (!this.isActive()) {
      throw new BusinessRuleError(`Captain "${this.id}" must be active before updating location.`);
    }
    this._currentLocation = new CurrentLocation(lat, lng, new Date());
    this._touch();
  }

  private _touch(): void {
    this._updatedAt = new Date();
  }
}
