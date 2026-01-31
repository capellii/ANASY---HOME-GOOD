import { Request, Response } from 'express';
import { ScenarioService } from '../services/ScenarioService';

export class ScenarioController {
  private scenarioService: ScenarioService;

  constructor() {
    this.scenarioService = new ScenarioService();
    this.getScenarios = this.getScenarios.bind(this);
    this.createScenario = this.createScenario.bind(this);
  }

  public async getScenarios(req: Request, res: Response) {
    try {
      const scenarios = await this.scenarioService.getScenarios();
      res.json(scenarios);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public async createScenario(req: Request, res: Response) {
    try {
      const scenario = await this.scenarioService.createScenario(req.body);
      res.status(201).json(scenario);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
