import { HealthMetric } from '../models/HealthMetric';
import { HealthRepository } from '../repositories/HealthRepository';

export class HealthService {
  private repository = new HealthRepository();

  public async getByUser(user_id: string): Promise<HealthMetric[]> {
    return this.repository.findByUser(user_id);
  }

  public async create(metricData: Omit<HealthMetric, 'id'>): Promise<HealthMetric> {
    return this.repository.create(metricData);
  }
}
