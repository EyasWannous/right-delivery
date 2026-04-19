import { inject, injectable } from 'tsyringe';
import { Captain } from '@/domain/captain/entities/captain.entity';
import { CaptainAvailability, CaptainStatus } from '@/domain/captain/entities/captain.enums';
import { CaptainDomainService } from '@/domain/captain/captain.domain-service';
import { ICaptainRepository } from '@/domain/captain/repositories/captain.repository.interface';
import { NotFoundError } from '@/domain/shared/errors';
import { CaptainDto, toCaptainDto } from '@/application/captain/dtos/captain.dto';
import { ICaptainApplicationService } from '@/application/captain/captain.application-service.interface';

@injectable()
export class CaptainApplicationService implements ICaptainApplicationService {
  constructor(
    @inject(ICaptainRepository)
    private readonly captainRepository: ICaptainRepository,
    @inject(CaptainDomainService)
    private readonly captainDomainService: CaptainDomainService,
  ) {}

  async createCaptain(params: {
    name: string;
    phone: string;
    vehicleType: string;
  }): Promise<CaptainDto> {
    const captain = await this.captainDomainService.createCaptain(params);
    return toCaptainDto(captain);
  }

  async getCaptain(id: string): Promise<CaptainDto> {
    const captain = await this.captainRepository.findById(id);
    if (!captain) {
      throw new NotFoundError('Captain', id);
    }
    return toCaptainDto(captain);
  }

  async listCaptains(filters: {
    status?: CaptainStatus;
    availability?: CaptainAvailability;
  }): Promise<CaptainDto[]> {
    const captains = await this.captainRepository.findAll(filters);
    return captains.map(toCaptainDto);
  }

  async updateCaptain(params: {
    id: string;
    name?: string;
    vehicleType?: string;
  }): Promise<CaptainDto> {
    const existing = await this.captainRepository.findById(params.id);
    if (!existing) {
      throw new NotFoundError('Captain', params.id);
    }

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
    return toCaptainDto(updated);
  }

  async deleteCaptain(id: string): Promise<void> {
    const captain = await this.captainRepository.findById(id);
    if (!captain) {
      throw new NotFoundError('Captain', id);
    }
    await this.captainRepository.delete(id);
  }

  async activateCaptain(id: string): Promise<CaptainDto> {
    const captain = await this.captainDomainService.activateCaptain(id);
    return toCaptainDto(captain);
  }

  async deactivateCaptain(id: string): Promise<CaptainDto> {
    const captain = await this.captainDomainService.deactivateCaptain(id);
    return toCaptainDto(captain);
  }
}
