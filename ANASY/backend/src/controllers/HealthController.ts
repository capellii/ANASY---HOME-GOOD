import { Request, Response } from 'express';
import { HealthService } from '../services/HealthService';

const service = new HealthService();

export class HealthController {
  public static async getByUser(req: Request, res: Response) {
    const { user_id } = req.params;
    const data = await service.getByUser(user_id);
    res.json(data);
  }

  public static async create(req: Request, res: Response) {
    const metric = await service.create(req.body);
    res.status(201).json(metric);
  }
}
