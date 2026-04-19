import { OrderVolumeDropFilters } from '@/domain/report/repositories/report.repository.interface';
import { OrderVolumeDropResponseDto } from '@/application/report/dtos/order-volume-drop.dto';

export const IReportApplicationService = Symbol('IReportApplicationService');

export interface IReportApplicationService {
  getCaptainOrderVolumeDrop(filters: OrderVolumeDropFilters): Promise<OrderVolumeDropResponseDto>;
}
