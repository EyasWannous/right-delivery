import { Captain } from '@/domain/captain/entities/captain.entity';
import { CaptainAvailability, CaptainStatus } from '@/domain/captain/entities/captain.enums';

export const ICaptainRepository = Symbol('ICaptainRepository');

export interface CaptainFilters {
  status?: CaptainStatus;
  availability?: CaptainAvailability;
}

export interface ICaptainRepository {
  findById(id: string): Promise<Captain | null>;

  findAll(filters: CaptainFilters): Promise<Captain[]>;

  save(captain: Captain): Promise<void>;

  delete(id: string): Promise<void>;
}
