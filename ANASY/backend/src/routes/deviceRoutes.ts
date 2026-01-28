import { Router } from 'express';
import { DeviceController } from '../controllers/DeviceController';

const router = Router();
const controller = new DeviceController();

router.get('/', controller.getDevices);
router.post('/', controller.createDevice);

export default router;
