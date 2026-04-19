import { inject, injectable } from 'tsyringe';
import {
  IReportRepository,
  OrderVolumeDropFilters,
} from '../../domain/report/repositories/report.repository.interface';
import { IReportApplicationService } from '@/application/report/report.application-service.interface';
import { OrderVolumeDropResponseDto } from '@/application/report/dtos/order-volume-drop.dto';

@injectable()
export class ReportApplicationService implements IReportApplicationService {
  constructor(
    @inject(IReportRepository)
    private readonly reportRepository: IReportRepository,
  ) {}

  async getCaptainOrderVolumeDrop(
    filters: OrderVolumeDropFilters,
  ): Promise<OrderVolumeDropResponseDto> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;

    const { results, total } = await this.reportRepository.getCaptainOrderVolumeDrop({
      ...filters,
      page,
      limit,
    });

    return {
      data: results,
      meta: {
        total,
        page,
        limit,
      },
    };
  }
}
