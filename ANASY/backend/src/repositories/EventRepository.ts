import { EventLog } from '../models/EventLog';
import pool from '../db/pgPool';

export class EventRepository {
  public async findByUser(user_id: string): Promise<EventLog[]> {
    const result = await pool.query('SELECT * FROM events WHERE user_id = $1', [user_id]);
    return result.rows;
  }

  public async create(eventData: Omit<EventLog, 'id'>): Promise<EventLog> {
    const result = await pool.query(
      'INSERT INTO events (user_id, event_type, device_id, data, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [eventData.user_id, eventData.event_type, eventData.device_id, eventData.data, eventData.created_at]
    );
    return result.rows[0];
  }
}
