import { injectable } from 'tsyringe';
import { Captain } from '@/domain/captain/entities/captain.entity';
import {
  ICaptainRepository,
  CaptainFilters,
} from '../../domain/captain/repositories/captain.repository.interface';
import { CaptainModel } from '@/infrastructure/database/mongoose/models/captain.model';
import { CaptainMapper } from '@/infrastructure/database/mongoose/mappers/captain.mapper';

@injectable()
export class MongoCaptainRepository implements ICaptainRepository {
  async findById(id: string): Promise<Captain | null> {
    const doc = await CaptainModel.findById(id).lean().exec();
    if (!doc) return null;
    return CaptainMapper.toDomain(doc as any);
  }

  async findAll(filters: CaptainFilters): Promise<Captain[]> {
    const query: Record<string, any> = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.availability) {
      query.availability = filters.availability;
    }

    const docs = await CaptainModel.find(query).lean().exec();
    return docs.map((doc) => CaptainMapper.toDomain(doc as any));
  }

  async save(captain: Captain): Promise<void> {
    await CaptainModel.findByIdAndUpdate(
      captain.id,
      { $set: CaptainMapper.toPersistence(captain) },
      { upsert: true, new: true },
    ).exec();
  }

  async delete(id: string): Promise<void> {
    await CaptainModel.findByIdAndDelete(id).exec();
  }
}
