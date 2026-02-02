import { Router } from 'express';
import { ScenarioController } from '../controllers/ScenarioController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';

const router = Router();
const controller = new ScenarioController();

router.get('/', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), controller.getScenarios);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), controller.createScenario);

export default router;
