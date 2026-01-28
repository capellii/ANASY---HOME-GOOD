import { Energy } from '../models/Energy';
import { EnergyRepository } from '../repositories/EnergyRepository';

export class EnergyService {
  private repository = new EnergyRepository();

  public async getByDevice(device_id: string): Promise<Energy[]> {
    return this.repository.findByDevice(device_id);
  }

  public async create(energyData: Omit<Energy, 'id'>): Promise<Energy> {
    return this.repository.create(energyData);
  }
}
