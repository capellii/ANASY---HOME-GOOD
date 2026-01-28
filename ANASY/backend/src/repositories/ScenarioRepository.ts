import { Scenario } from '../models/Scenario';
import { v4 as uuidv4 } from 'uuid';

const scenarios: Scenario[] = [];

export class ScenarioRepository {
  public async findAll(): Promise<Scenario[]> {
    return scenarios;
  }

  public async create(scenarioData: Omit<Scenario, 'id'>): Promise<Scenario> {
    const scenario: Scenario = { id: uuidv4(), ...scenarioData };
    scenarios.push(scenario);
    return scenario;
  }
}
