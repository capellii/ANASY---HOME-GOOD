import { Router } from 'express';
import { SecurityController } from '../controllers/SecurityController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();

router.get('/user/:user_id', authenticateJWT, authorizeRoles('admin', 'owner'), SecurityController.getByUser);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), SecurityController.create);

export default router;
