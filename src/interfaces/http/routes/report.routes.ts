import { Router } from 'express';
import { container } from 'tsyringe';
import { ReportController } from '@/interfaces/http/controllers/report.controller';

const router = Router();
const controller = container.resolve(ReportController);

router.get('/captains/order-volume-drop', controller.getCaptainOrderVolumeDrop);

export default router;
