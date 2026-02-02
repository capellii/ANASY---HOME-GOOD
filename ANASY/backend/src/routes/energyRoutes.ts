import { Router } from 'express';
import { EnergyController } from '../controllers/EnergyController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate, createEnergySchema } from '../middleware/validation';

const router = Router();

router.get('/device/:device_id', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), EnergyController.getByDevice);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), validate(createEnergySchema), EnergyController.create);

export default router;
