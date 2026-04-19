import { Router } from 'express';
import { container } from 'tsyringe';
import { OrderController } from '@/interfaces/http/controllers/order.controller';

const router = Router();
const controller = container.resolve(OrderController);

router.post('/', controller.createOrder);
router.get('/', controller.listOrders);
router.get('/:id', controller.getOrder);
router.patch('/:id', controller.updateOrder);
router.delete('/:id', controller.deleteOrder);
router.post('/:id/assign', controller.assignCaptain);
router.delete('/:id/assign', controller.unassignCaptain);
router.patch('/:id/status', controller.updateOrderStatus);
router.patch('/:id/cancel', controller.cancelOrder);

export default router;
