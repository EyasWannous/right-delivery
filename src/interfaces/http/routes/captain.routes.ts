import { Router } from 'express';
import { container } from 'tsyringe';
import { CaptainController } from '@/interfaces/http/controllers/captain.controller';

const router = Router();
const controller = container.resolve(CaptainController);

router.post('/', controller.createCaptain);
router.get('/', controller.listCaptains);
router.get('/:id', controller.getCaptain);
router.patch('/:id', controller.updateCaptain);
router.delete('/:id', controller.deleteCaptain);
router.patch('/:id/activate', controller.activateCaptain);
router.patch('/:id/deactivate', controller.deactivateCaptain);

export default router;
