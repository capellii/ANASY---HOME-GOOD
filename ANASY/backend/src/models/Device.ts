export interface Device {
  id: string;
  name: string;
  type: 'light' | 'plug' | 'ac' | 'lock';
  protocol: 'zigbee' | 'zwave' | 'wifi';
  status: any;
  energyConsumption?: number;
  lastSeen?: Date;
  batteryLevel?: number;
}
