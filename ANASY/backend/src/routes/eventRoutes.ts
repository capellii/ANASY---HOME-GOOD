import { Router } from 'express';
import { EventController } from '../controllers/EventController';

const router = Router();

router.get('/user/:user_id', EventController.getByUser);
router.post('/', EventController.create);

export default router;
