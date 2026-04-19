import { Router } from 'express';
import { container } from 'tsyringe';
import { PartnerController } from '@/interfaces/http/controllers/partner.controller';
import { partnerAuthMiddleware } from '@/interfaces/http/middlewares/partner-auth.middleware';
import { partnerRateLimiter } from '@/interfaces/http/middlewares/partner-rate-limit.middleware';

const router = Router();
const controller = container.resolve(PartnerController);

router.use(partnerRateLimiter);
router.use(partnerAuthMiddleware);

router.post('/orders', controller.createOrder);
router.get('/orders/:ref', controller.getOrderByReference);

export default router;
