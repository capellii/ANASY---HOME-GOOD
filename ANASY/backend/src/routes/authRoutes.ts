import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validate, loginSchema, registerSchema } from '../middleware/validation';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login);
router.post('/register', validate(registerSchema), controller.register);
router.post('/refresh', controller.refreshToken);

export default router;
