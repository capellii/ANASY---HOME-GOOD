import { Router } from 'express';
import { EnergyController } from '../controllers/EnergyController';

const router = Router();

router.get('/device/:device_id', EnergyController.getByDevice);
router.post('/', EnergyController.create);

export default router;
