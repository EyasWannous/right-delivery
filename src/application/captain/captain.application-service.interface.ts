import { CaptainAvailability, CaptainStatus } from '@/domain/captain/entities/captain.enums';
import { CaptainDto } from '@/application/captain/dtos/captain.dto';

export const ICaptainApplicationService = Symbol('ICaptainApplicationService');

export interface ICaptainApplicationService {
  createCaptain(params: { name: string; phone: string; vehicleType: string }): Promise<CaptainDto>;

  getCaptain(id: string): Promise<CaptainDto>;

  listCaptains(filters: {
    status?: CaptainStatus;
    availability?: CaptainAvailability;
  }): Promise<CaptainDto[]>;

  updateCaptain(params: { id: string; name?: string; vehicleType?: string }): Promise<CaptainDto>;

  deleteCaptain(id: string): Promise<void>;

  activateCaptain(id: string): Promise<CaptainDto>;

  deactivateCaptain(id: string): Promise<CaptainDto>;
}
