import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';

const router = Router();

router.get('/user/:user_id', HealthController.getByUser);
router.post('/', HealthController.create);

export default router;
