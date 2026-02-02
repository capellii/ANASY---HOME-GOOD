import { Energy } from '../models/Energy';
import pool from '../db/pgPool';

export class EnergyRepository {
  public async findByDevice(device_id: string): Promise<Energy[]> {
    const result = await pool.query('SELECT * FROM energy_consumption WHERE device_id = $1', [device_id]);
    return result.rows;
  }

  public async create(energyData: Omit<Energy, 'id'>): Promise<Energy> {
    const result = await pool.query(
      'INSERT INTO energy_consumption (device_id, power_watts) VALUES ($1, $2) RETURNING *',
      [energyData.device_id, energyData.power_watts]
    );
    return result.rows[0];
  }
}
