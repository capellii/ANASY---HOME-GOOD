import { Request, Response } from 'express';
import { EnergyService } from '../services/EnergyService';

const service = new EnergyService();

export class EnergyController {
  public static async getByDevice(req: Request, res: Response) {
    const { device_id } = req.params;
    const data = await service.getByDevice(device_id);
    res.json(data);
  }

  public static async create(req: Request, res: Response) {
    const energy = await service.create(req.body);
    res.status(201).json(energy);
  }
}
