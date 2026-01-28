import { Router } from 'express';
import { SecurityController } from '../controllers/SecurityController';

const router = Router();

router.get('/user/:user_id', SecurityController.getByUser);
router.post('/', SecurityController.create);

export default router;
