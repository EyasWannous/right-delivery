import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'tsyringe';
import { ICaptainApplicationService } from '@/application/captain/captain.application-service.interface';
import {
  CreateCaptainSchema,
  UpdateCaptainSchema,
  ListCaptainsSchema,
} from '../validators/captain.validators';

@injectable()
export class CaptainController {
  constructor(
    @inject(ICaptainApplicationService)
    private readonly captainService: ICaptainApplicationService,
  ) {}

  createCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = CreateCaptainSchema.parse(req.body);
      const result = await this.captainService.createCaptain(parsed);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  getCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.captainService.getCaptain(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  listCaptains = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = ListCaptainsSchema.parse(req.query);
      const result = await this.captainService.listCaptains(parsed as any);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = UpdateCaptainSchema.parse(req.body);
      const result = await this.captainService.updateCaptain({ id: req.params.id, ...parsed });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.captainService.deleteCaptain(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  activateCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.captainService.activateCaptain(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deactivateCaptain = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.captainService.deactivateCaptain(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
