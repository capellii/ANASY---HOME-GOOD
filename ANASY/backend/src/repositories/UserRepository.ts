
import { User } from '../models/User';
import pool from '../db/pgPool';

export class UserRepository {
  public async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0];
  }

  public async findById(id: string): Promise<User | undefined> {
    const result = await pool.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0];
  }

  public async create(userData: Omit<User, 'id'>): Promise<User> {
    const result = await pool.query(
      'INSERT INTO users (name, email, password, subscription_plan, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userData.name, userData.email, userData.password, userData.subscriptionPlan, userData.role]
    );
    return result.rows[0];
  }
}
