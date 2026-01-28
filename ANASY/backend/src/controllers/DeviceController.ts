import { DeviceService } from '../services/DeviceService';

export class DeviceController {
  private deviceService: DeviceService;

  constructor() {
    this.deviceService = new DeviceService();
    this.getDevices = this.getDevices.bind(this);
    this.createDevice = this.createDevice.bind(this);
  }

  public async getDevices(req, res) {
    try {
      const devices = await this.deviceService.getDevices();
      res.json(devices);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  public async createDevice(req, res) {
    try {
      const device = await this.deviceService.createDevice(req.body);
      res.status(201).json(device);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
