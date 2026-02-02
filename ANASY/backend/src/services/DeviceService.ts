import { DeviceRepository } from '../repositories/DeviceRepository';
import { Device } from '../models/Device';

export class DeviceService {
  private deviceRepository: DeviceRepository;

  constructor() {
    this.deviceRepository = new DeviceRepository();
  }

  public async getDevices(): Promise<Device[]> {
    return this.deviceRepository.findAll();
  }

  public async createDevice(deviceData: Omit<Device, 'id'>): Promise<Device> {
    return this.deviceRepository.create(deviceData);
  }

  public async updateDeviceStatus(id: string, status: any): Promise<Device | undefined> {
    return this.deviceRepository.updateStatus(id, status);
  }
}
