import { ScenarioService } from '../services/ScenarioService';

export class ScenarioController {
  private scenarioService: ScenarioService;

  constructor() {
    this.scenarioService = new ScenarioService();
    this.getScenarios = this.getScenarios.bind(this);
    this.createScenario = this.createScenario.bind(this);
  }

  public async getScenarios(req, res) {
    try {
      const scenarios = await this.scenarioService.getScenarios();
      res.json(scenarios);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  public async createScenario(req, res) {
    try {
      const scenario = await this.scenarioService.createScenario(req.body);
      res.status(201).json(scenario);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
