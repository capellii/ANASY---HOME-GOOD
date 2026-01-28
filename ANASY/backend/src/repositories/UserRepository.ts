
import { User } from '../models/User';
import pool from '../db/pgPool';

export class UserRepository {
  public async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0];
  }

  public async create(userData: Omit<User, 'id'>): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [userData.name, userData.email, userData.password]
    );
    return result.rows[0];
  }
}
