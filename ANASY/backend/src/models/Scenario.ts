export interface Scenario {
  id: string;
  name: string;
  description?: string;
  trigger: any;
  conditions?: any[];
  actions: any[];
  enabled: boolean;
}
