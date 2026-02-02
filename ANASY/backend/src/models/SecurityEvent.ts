export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  device_id?: string;
  created_at: Date;
}
