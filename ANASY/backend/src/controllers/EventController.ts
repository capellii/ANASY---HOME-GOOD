import { Request, Response } from 'express';
import { EventService } from '../services/EventService';

const service = new EventService();

export class EventController {
  public static async getByUser(req: Request, res: Response) {
    const { user_id } = req.params;
    const data = await service.getByUser(user_id);
    res.json(data);
  }

  public static async create(req: Request, res: Response) {
    const event = await service.create(req.body);
    res.status(201).json(event);
  }
}
