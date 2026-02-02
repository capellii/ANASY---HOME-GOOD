import { Request, Response } from 'express';
import { HealthService } from '../services/HealthService';

const service = new HealthService();

export class HealthController {
  public static async getByUser(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
      const data = await service.getByUser(user_id);
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public static async create(req: Request, res: Response) {
    try {
      // Map metric_value to value for database compatibility
      const metricData = {
        user_id: req.body.user_id,
        metric_type: req.body.metric_type,
        value: req.body.metric_value || req.body.value,
        device_id: req.body.device_id,
        timestamp: new Date()
      };
      const metric = await service.create(metricData);
      res.status(201).json(metric);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
