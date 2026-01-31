
import { Scenario } from '../models/Scenario';
import pool from '../db/pgPool';

export class ScenarioRepository {
  public async findAll(): Promise<Scenario[]> {
    const result = await pool.query('SELECT * FROM scenarios');
    return result.rows;
  }

  public async create(scenarioData: Omit<Scenario, 'id'>): Promise<Scenario> {
    const result = await pool.query(
      'INSERT INTO scenarios (name, description, trigger, conditions, actions, enabled) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        scenarioData.name,
        scenarioData.description ?? null,
        scenarioData.trigger,
        scenarioData.conditions ?? null,
        scenarioData.actions,
        scenarioData.enabled
      ]
    );
    return result.rows[0];
  }
}
