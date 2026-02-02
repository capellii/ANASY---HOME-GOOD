import { Router } from 'express';
import { ScenarioController } from '../controllers/ScenarioController';
import { authenticateJWT, authorizeRoles } from '../middleware/auth';
import { validate, createScenarioSchema } from '../middleware/validation';

const router = Router();
const scenarioController = new ScenarioController();

router.get('/', authenticateJWT, authorizeRoles('admin', 'owner', 'member'), scenarioController.getAll);
router.post('/', authenticateJWT, authorizeRoles('admin', 'owner'), validate(createScenarioSchema), scenarioController.create);

export default router;
