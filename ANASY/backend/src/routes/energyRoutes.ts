import { Router } from 'express';
import { EnergyController } from '../controllers/EnergyController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/device/:device_id', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), EnergyController.getByDevice);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), EnergyController.create);

export default router;
