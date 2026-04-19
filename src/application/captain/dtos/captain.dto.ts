import { Captain } from '@/domain/captain/entities/captain.entity';

export interface CaptainDto {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  status: string;
  availability: string;
  currentLocation: { lat: number; lng: number; updatedAt: Date } | null;
  createdAt: Date;
  updatedAt: Date;
}

export function toCaptainDto(captain: Captain): CaptainDto {
  return {
    id: captain.id,
    name: captain.name,
    phone: captain.phone.value,
    vehicleType: captain.vehicleType,
    status: captain.status,
    availability: captain.availability,
    currentLocation:
      captain.currentLocation !== null
        ? {
            lat: captain.currentLocation.lat,
            lng: captain.currentLocation.lng,
            updatedAt: captain.currentLocation.updatedAt,
          }
        : null,
    createdAt: captain.createdAt,
    updatedAt: captain.updatedAt,
  };
}
