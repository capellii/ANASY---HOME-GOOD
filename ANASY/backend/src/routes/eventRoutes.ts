import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/user/:user_id', authenticateJWT, authorizeRoles('admin', 'owner'), EventController.getByUser);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), EventController.create);

export default router;
