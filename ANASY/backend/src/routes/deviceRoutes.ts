import { Router } from 'express';
import { DeviceController } from '../controllers/DeviceController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate, createDeviceSchema, updateDeviceStatusSchema } from '../middleware/validation';

const router = Router();
const deviceController = new DeviceController();

router.get('/', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), deviceController.getAll);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), validate(createDeviceSchema), deviceController.create);
router.patch('/:id/status', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), validate(updateDeviceStatusSchema), deviceController.updateDeviceStatus);

export default router;
