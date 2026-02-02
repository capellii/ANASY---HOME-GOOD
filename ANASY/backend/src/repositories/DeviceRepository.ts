
import { Device } from '../models/Device';
import pool from '../db/pgPool';

export class DeviceRepository {
  public async findAll(): Promise<Device[]> {
    const result = await pool.query('SELECT * FROM devices');
    return result.rows;
  }

  public async create(deviceData: Omit<Device, 'id'>): Promise<Device> {
    const statusJson = typeof deviceData.status === 'string' 
      ? JSON.stringify({ state: deviceData.status })
      : JSON.stringify(deviceData.status || {});
      
    const result = await pool.query(
      'INSERT INTO devices (name, type, protocol, status, energy_consumption, last_seen, battery_level) VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7) RETURNING *',
      [
        deviceData.name,
        deviceData.type,
        deviceData.protocol || 'unknown',
        statusJson,
        deviceData.energyConsumption ?? null,
        deviceData.lastSeen ?? null,
        deviceData.batteryLevel ?? null
      ]
    );
    return result.rows[0];
  }

  public async updateStatus(id: string, status: any): Promise<Device | undefined> {
    const statusJson = typeof status === 'string' 
      ? JSON.stringify({ state: status })
      : JSON.stringify(status);
      
    const result = await pool.query(
      'UPDATE devices SET status = $1::jsonb, last_seen = NOW() WHERE id = $2 RETURNING *',
      [statusJson, id]
    );
    return result.rows[0];
  }
}
