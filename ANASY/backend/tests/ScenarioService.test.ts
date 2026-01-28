import { ScenarioService } from '../src/services/ScenarioService';

describe('ScenarioService', () => {
  const service = new ScenarioService();

  it('should create and get scenarios', async () => {
    const scenario = await service.createScenario({
      name: 'Night Mode',
      trigger: { type: 'time', value: '22:00' },
      actions: [{ deviceId: '1', command: 'off' }],
      enabled: true
    });
    expect(scenario.name).toBe('Night Mode');
    const scenarios = await service.getScenarios();
    expect(scenarios.length).toBeGreaterThan(0);
  });
});
