import { User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';

// Mock database
const users: User[] = [];

export class UserRepository {
  public async findByEmail(email: string): Promise<User | undefined> {
    return users.find((user) => user.email === email);
  }

  public async create(userData: Omit<User, 'id'>): Promise<User> {
    const user: User = { id: uuidv4(), ...userData };
    users.push(user);
    return user;
  }
}
