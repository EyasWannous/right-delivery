import { inject, injectable } from 'tsyringe';
import { Captain } from '@/domain/captain/entities/captain.entity';
import { ICaptainRepository } from '@/domain/captain/repositories/captain.repository.interface';
import { NotFoundError } from '@/domain/shared/errors';

@injectable()
export class CaptainDomainService {
  constructor(
    @inject(ICaptainRepository)
    private readonly captainRepository: ICaptainRepository,
  ) {}

  private async getOrThrow(id: string): Promise<Captain> {
    const captain = await this.captainRepository.findById(id);
    if (!captain) {
      throw new NotFoundError('Captain', id);
    }
    return captain;
  }

  async createCaptain(params: {
    name: string;
    phone: string;
    vehicleType: string;
  }): Promise<Captain> {
    const captain = Captain.create({
      id: crypto.randomUUID(),
      name: params.name,
      phone: params.phone,
      vehicleType: params.vehicleType,
    });
    await this.captainRepository.save(captain);
    return captain;
  }

  async updateCaptain(params: {
    id: string;
    name?: string;
    vehicleType?: string;
  }): Promise<Captain> {
    const existing = await this.getOrThrow(params.id);

    const updated = Captain.reconstitute({
      id: existing.id,
      name: params.name ?? existing.name,
      phone: existing.phone,
      vehicleType: params.vehicleType ?? existing.vehicleType,
      status: existing.status,
      availability: existing.availability,
      currentLocation: existing.currentLocation,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.captainRepository.save(updated);
    return updated;
  }

  async deleteCaptain(id: string): Promise<void> {
    await this.getOrThrow(id);
    await this.captainRepository.delete(id);
  }

  async activateCaptain(id: string): Promise<Captain> {
    const captain = await this.getOrThrow(id);
    captain.activate();
    await this.captainRepository.save(captain);
    return captain;
  }

  async deactivateCaptain(id: string): Promise<Captain> {
    const captain = await this.getOrThrow(id);
    captain.deactivate();
    await this.captainRepository.save(captain);
    return captain;
  }

  async updateCaptainLocation(id: string, lat: number, lng: number): Promise<Captain> {
    const captain = await this.getOrThrow(id);
    captain.updateLocation(lat, lng);
    await this.captainRepository.save(captain);
    return captain;
  }
}
