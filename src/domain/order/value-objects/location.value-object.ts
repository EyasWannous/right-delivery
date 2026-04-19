import { ValidationError } from '@/domain/shared/errors';

export class Location {
  readonly lat: number;
  readonly lng: number;

  constructor(lat: number, lng: number) {
    if (lat < -90 || lat > 90) {
      throw new ValidationError(`Invalid latitude "${lat}". Must be between -90 and 90.`);
    }
    if (lng < -180 || lng > 180) {
      throw new ValidationError(`Invalid longitude "${lng}". Must be between -180 and 180.`);
    }
    this.lat = lat;
    this.lng = lng;
  }

  equals(other: Location): boolean {
    return this.lat === other.lat && this.lng === other.lng;
  }

  toString(): string {
    return `(${this.lat}, ${this.lng})`;
  }
}
