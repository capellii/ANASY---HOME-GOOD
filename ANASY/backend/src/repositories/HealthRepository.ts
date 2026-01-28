import { HealthMetric } from '../models/HealthMetric';
import pool from '../db/pgPool';

export class HealthRepository {
  public async findByUser(user_id: string): Promise<HealthMetric[]> {
    const result = await pool.query('SELECT * FROM health_metrics WHERE user_id = $1', [user_id]);
    return result.rows;
  }

  public async create(metricData: Omit<HealthMetric, 'id'>): Promise<HealthMetric> {
    const result = await pool.query(
      'INSERT INTO health_metrics (user_id, metric_type, value, timestamp, device_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [metricData.user_id, metricData.metric_type, metricData.value, metricData.timestamp, metricData.device_id]
    );
    return result.rows[0];
  }
}
