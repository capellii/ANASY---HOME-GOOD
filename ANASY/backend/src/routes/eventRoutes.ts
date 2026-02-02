import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate, createEventSchema } from '../middleware/validation';

const router = Router();

router.get('/user/:user_id', authenticateJWT, authorizeRoles('admin', 'owner'), EventController.getByUser);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), validate(createEventSchema), EventController.create);

export default router;
