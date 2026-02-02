import { Router } from 'express';
import { DeviceController } from '../controllers/DeviceController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();
const controller = new DeviceController();

router.get('/', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), controller.getDevices);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), controller.createDevice);
router.patch('/:id/status', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), controller.updateDeviceStatus);

export default router;
