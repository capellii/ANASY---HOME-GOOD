import { UserRepository } from '../repositories/UserRepository';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'anasy_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'anasy_refresh_secret';
const REFRESH_TOKEN_EXPIRY = '7d';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(email: string, password: string, name: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) throw new Error('Email already registered');
    // TODO: Hash password in production
    // Por padrão, role = 'owner' para o primeiro usuário
    return this.userRepository.create({ email, password, name, subscriptionPlan: 'basic', role: 'owner' });
  }

  public async login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.password !== password) throw new Error('Invalid credentials');
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { user, accessToken, refreshToken };
  }

  public async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
      const user = await this.userRepository.findById(decoded.id);
      if (!user) throw new Error('User not found');
      const payload = { id: user.id, email: user.email, role: user.role };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      return { accessToken };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}
