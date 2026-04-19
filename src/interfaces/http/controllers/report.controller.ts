import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IReportApplicationService } from '@/application/report/report.application-service.interface';
import { OrderVolumeDropQuerySchema } from '@/application/report/dtos/order-volume-drop.dto';

@injectable()
export class ReportController {
  constructor(
    @inject(IReportApplicationService)
    private readonly reportService: IReportApplicationService,
  ) {}

  getCaptainOrderVolumeDrop = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = OrderVolumeDropQuerySchema.parse(req.query);
      const result = await this.reportService.getCaptainOrderVolumeDrop(parsed);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
