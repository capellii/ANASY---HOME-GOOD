
import { Scenario } from '../models/Scenario';
import pool from '../db/pgPool';

export class ScenarioRepository {
  public async findAll(): Promise<Scenario[]> {
    const result = await pool.query('SELECT * FROM scenarios');
    return result.rows;
  }

  public async create(scenarioData: Omit<Scenario, 'id'>): Promise<Scenario> {
    const toJson = (value: unknown, fallback: string | null) => {
      if (value === undefined || value === null) return fallback;
      if (typeof value === 'string') return value;
      return JSON.stringify(value);
    };

    const result = await pool.query(
      'INSERT INTO scenarios (name, description, trigger, conditions, actions, enabled) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        scenarioData.name,
        scenarioData.description ?? null,
        toJson(scenarioData.trigger, '{}'),
        toJson(scenarioData.conditions, null),
        toJson(scenarioData.actions, '{}'),
        scenarioData.enabled ?? true
      ]
    );
    return result.rows[0];
  }
}
