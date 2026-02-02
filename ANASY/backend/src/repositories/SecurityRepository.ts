import { SecurityEvent } from '../models/SecurityEvent';
import pool from '../db/pgPool';

export class SecurityRepository {
  public async findByUser(user_id: string): Promise<SecurityEvent[]> {
    const result = await pool.query('SELECT * FROM security_events WHERE user_id = $1 ORDER BY created_at DESC', [user_id]);
    return result.rows;
  }

  public async create(eventData: Omit<SecurityEvent, 'id' | 'created_at'>): Promise<SecurityEvent> {
    const result = await pool.query(
      'INSERT INTO security_events (user_id, event_type, severity, description, device_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [eventData.user_id, eventData.event_type, eventData.severity, eventData.description, eventData.device_id || null]
    );
    return result.rows[0];
  }
}
