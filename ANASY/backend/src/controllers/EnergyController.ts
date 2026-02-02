import { Request, Response } from 'express';
import { EnergyService } from '../services/EnergyService';

const service = new EnergyService();

export class EnergyController {
  public static async getByDevice(req: Request, res: Response) {
    try {
      const { device_id } = req.params;
      const data = await service.getByDevice(device_id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async create(req: Request, res: Response) {
    try {
      // Map consumption_kwh to power_watts (1 kWh = 1000 watts)
      const energyData = {
        device_id: req.body.device_id,
        power_watts: req.body.consumption_kwh ? req.body.consumption_kwh * 1000 : req.body.power_watts,
        timestamp: new Date()
      };
      const energy = await service.create(energyData);
      res.status(201).json(energy);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
