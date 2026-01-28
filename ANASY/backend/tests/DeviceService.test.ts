import { DeviceService } from '../src/services/DeviceService';

describe('DeviceService', () => {
  const service = new DeviceService();

  it('should create and get devices', async () => {
    const device = await service.createDevice({
      name: 'Lamp',
      type: 'light',
      protocol: 'zigbee',
      status: { state: 'on' }
    });
    expect(device.name).toBe('Lamp');
    const devices = await service.getDevices();
    expect(devices.length).toBeGreaterThan(0);
  });
});
