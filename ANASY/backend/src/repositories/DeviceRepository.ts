
import { Device } from '../models/Device';
import pool from '../db/pgPool';

export class DeviceRepository {
  public async findAll(): Promise<Device[]> {
    const result = await pool.query('SELECT * FROM devices');
    return result.rows;
  }

  public async create(deviceData: Omit<Device, 'id'>): Promise<Device> {
    const result = await pool.query(
      'INSERT INTO devices (name, type, status) VALUES ($1, $2, $3) RETURNING *',
      [deviceData.name, deviceData.type, deviceData.status]
    );
    return result.rows[0];
  }
}
