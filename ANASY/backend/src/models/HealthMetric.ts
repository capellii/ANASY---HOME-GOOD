export interface HealthMetric {
  id: string;
  user_id: string;
  metric_type: string; // 'heart_rate', 'blood_pressure', etc
  value: number;
  timestamp: Date;
  device_id?: string;
}
