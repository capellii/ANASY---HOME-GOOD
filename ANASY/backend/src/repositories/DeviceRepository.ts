import { Device } from '../models/Device';
import { v4 as uuidv4 } from 'uuid';

const devices: Device[] = [];

export class DeviceRepository {
  public async findAll(): Promise<Device[]> {
    return devices;
  }

  public async create(deviceData: Omit<Device, 'id'>): Promise<Device> {
    const device: Device = { id: uuidv4(), ...deviceData };
    devices.push(device);
    return device;
  }
}
