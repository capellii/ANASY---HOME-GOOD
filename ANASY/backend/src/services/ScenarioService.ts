import { ScenarioRepository } from '../repositories/ScenarioRepository';
import { Scenario } from '../models/Scenario';

export class ScenarioService {
  private scenarioRepository: ScenarioRepository;

  constructor() {
    this.scenarioRepository = new ScenarioRepository();
  }

  public async getScenarios(): Promise<Scenario[]> {
    return this.scenarioRepository.findAll();
  }

  public async createScenario(scenarioData: Omit<Scenario, 'id'>): Promise<Scenario> {
    return this.scenarioRepository.create(scenarioData);
  }
}
