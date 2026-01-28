import { EventLog } from '../models/EventLog';
import { EventRepository } from '../repositories/EventRepository';

export class EventService {
  private repository = new EventRepository();

  public async getByUser(user_id: string): Promise<EventLog[]> {
    return this.repository.findByUser(user_id);
  }

  public async create(eventData: Omit<EventLog, 'id'>): Promise<EventLog> {
    return this.repository.create(eventData);
  }
}
