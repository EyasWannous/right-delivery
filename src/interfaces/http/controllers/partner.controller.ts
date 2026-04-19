import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IOrderApplicationService } from '@/application/order/order.application-service.interface';
import { IOrderRepository } from '@/domain/order/repositories/order.repository.interface';
import {
  PartnerCreateOrderSchema,
  PartnerGetOrderSchema,
} from '@/interfaces/http/validators/partner.validators';
import { NotFoundError } from '@/domain/shared/errors';

@injectable()
export class PartnerController {
  constructor(
    @inject(IOrderApplicationService)
    private readonly orderService: IOrderApplicationService,
    @inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = PartnerCreateOrderSchema.parse(req.body);

      const existing = await this.orderRepository.findByExternalReference(parsed.externalReference);
      if (existing) {
        res.status(200).json(existing);
        return;
      }

      const result = await this.orderService.createOrder(parsed);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getOrderByReference = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = PartnerGetOrderSchema.parse(req.params);

      const order = await this.orderRepository.findByExternalReference(parsed.ref);
      if (!order) {
        throw new NotFoundError('Order', parsed.ref);
      }

      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
  };
}
