import { SecurityEvent } from '../models/SecurityEvent';
import { SecurityRepository } from '../repositories/SecurityRepository';

export class SecurityService {
  private repository = new SecurityRepository();

  public async getByUser(user_id: string): Promise<SecurityEvent[]> {
    return this.repository.findByUser(user_id);
  }

  public async create(eventData: Omit<SecurityEvent, 'id'>): Promise<SecurityEvent> {
    return this.repository.create(eventData);
  }
}
