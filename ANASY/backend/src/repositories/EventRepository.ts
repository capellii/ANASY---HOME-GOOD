import { EventLog } from '../models/EventLog';
import pool from '../db/pgPool';

export class EventRepository {
  public async findByUser(user_id: string): Promise<EventLog[]> {
    const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [user_id]);
    return result.rows;
  }

  public async create(eventData: Omit<EventLog, 'id' | 'created_at'>): Promise<EventLog> {
    const result = await pool.query(
      'INSERT INTO events (user_id, event_type, device_id, data) VALUES ($1, $2, $3, $4) RETURNING *',
      [eventData.user_id, eventData.event_type, eventData.device_id || null, eventData.data || null]
    );
    return result.rows[0];
  }
}
