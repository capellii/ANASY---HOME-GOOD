import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate, createHealthMetricSchema } from '../middleware/validation';

const router = Router();

router.get('/user/:user_id', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), HealthController.getByUser);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), validate(createHealthMetricSchema), HealthController.create);

export default router;
