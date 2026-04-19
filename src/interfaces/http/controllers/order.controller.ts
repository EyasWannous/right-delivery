import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { IOrderApplicationService } from '@/application/order/order.application-service.interface';
import {
  CreateOrderSchema,
  UpdateOrderSchema,
  ListOrdersSchema,
  AssignCaptainSchema,
  UpdateOrderStatusSchema,
} from '../validators/order.validators';

@injectable()
export class OrderController {
  constructor(
    @inject(IOrderApplicationService)
    private readonly orderService: IOrderApplicationService,
  ) {}

  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = CreateOrderSchema.parse(req.body);
      const result = await this.orderService.createOrder(parsed);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.orderService.getOrder(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  listOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = ListOrdersSchema.parse(req.query);
      const result = await this.orderService.listOrders(parsed as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = UpdateOrderSchema.parse(req.body);
      const result = await this.orderService.updateOrder({ id: req.params.id, ...parsed });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.orderService.deleteOrder(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  assignCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = AssignCaptainSchema.parse(req.body);
      const result = await this.orderService.assignCaptain({
        orderId: req.params.id,
        captainId: parsed.captainId,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  unassignCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.orderService.unassignCaptain(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = UpdateOrderStatusSchema.parse(req.body);
      const result = await this.orderService.updateOrderStatus({
        orderId: req.params.id,
        action: parsed.action,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.orderService.cancelOrder(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
