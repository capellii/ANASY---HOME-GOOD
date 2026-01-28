import { Router } from 'express';
import { ScenarioController } from '../controllers/ScenarioController';

const router = Router();
const controller = new ScenarioController();

router.get('/', controller.getScenarios);
router.post('/', controller.createScenario);

export default router;
