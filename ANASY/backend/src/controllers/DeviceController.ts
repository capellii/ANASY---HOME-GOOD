import { Request, Response } from 'express';
import { DeviceService } from '../services/DeviceService';

export class DeviceController {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
    this.getAll = this.getAll.bind(this);
    this.getDevices = this.getDevices.bind(this);
    this.create = this.create.bind(this);
    this.createDevice = this.createDevice.bind(this);
    this.updateDeviceStatus = this.updateDeviceStatus.bind(this);
  }

  // Alias for backwards compatibility
  public async getAll(req: Request, res: Response) {
    return this.getDevices(req, res);
  }

  // Alias for backwards compatibility
  public async create(req: Request, res: Response) {
    return this.createDevice(req, res);
  }

  public async getDevices(req: Request, res: Response) {
    try {
      const devices = await this.deviceService.getDevices();
      res.json(devices);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  public async createDevice(req: Request, res: Response) {
    try {
      const device = await this.deviceService.createDevice(req.body);
      // Convert id to string for consistent JSON response
      const response = { ...device, id: device.id.toString() };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  public async updateDeviceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      const device = await this.deviceService.updateDeviceStatus(id, status);
      if (!device) {
        return res.status(404).json({ error: 'Device not found' });
      }
      res.json(device);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
