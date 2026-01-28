export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: string;
  device_id?: string;
  data?: any;
  created_at: Date;
}
