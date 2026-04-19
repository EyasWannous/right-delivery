import { Captain } from '@/domain/captain/entities/captain.entity';
import {
  CaptainStatus,
  CaptainAvailability,
} from '../../../../domain/captain/entities/captain.enums';
import { Phone } from '@/domain/shared/value-objects/phone.value-object';
import { CurrentLocation } from '@/domain/captain/value-objects/current-location.value-object';
import { CaptainDocument } from '@/infrastructure/database/mongoose/models/captain.model';

export class CaptainMapper {
  static toDomain(doc: CaptainDocument): Captain {
    return Captain.reconstitute({
      id: doc._id as string,
      name: doc.name,
      phone: new Phone(doc.phone),
      vehicleType: doc.vehicleType,
      status: doc.status as CaptainStatus,
      availability: doc.availability as CaptainAvailability,
      currentLocation: doc.currentLocation
        ? new CurrentLocation(
            doc.currentLocation.lat,
            doc.currentLocation.lng,
            doc.currentLocation.updatedAt,
          )
        : null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  static toPersistence(captain: Captain): Record<string, unknown> {
    return {
      _id: captain.id,
      name: captain.name,
      phone: captain.phone.value,
      vehicleType: captain.vehicleType,
      status: captain.status,
      availability: captain.availability,
      currentLocation: captain.currentLocation
        ? {
            lat: captain.currentLocation.lat,
            lng: captain.currentLocation.lng,
            updatedAt: captain.currentLocation.updatedAt,
          }
        : undefined,
      createdAt: captain.createdAt,
      updatedAt: captain.updatedAt,
    };
  }
}
