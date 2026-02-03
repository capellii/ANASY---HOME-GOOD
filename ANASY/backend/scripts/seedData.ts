import pool from '../src/db/pgPool';

async function seedData() {
  try {
    console.log('🌱 Starting database seed...');

    // Get João's user ID
    const userResult = await pool.query("SELECT id FROM users WHERE email = 'joao@teste.com'");
    if (userResult.rows.length === 0) {
      console.log('❌ User joao@teste.com not found. Please register first.');
      return;
    }
    const userId = userResult.rows[0].id;
    console.log(`✅ Found user: ${userId}`);

    // Create devices
    console.log('📱 Creating devices...');
    const devices = [
      { name: 'Sala - Luz Principal', type: 'light', protocol: 'wifi', status: { power: 'on', brightness: 80 } },
      { name: 'Quarto - Ar Condicionado', type: 'ac', protocol: 'wifi', status: { power: 'on', temperature: 22 } },
      { name: 'Cozinha - Tomada', type: 'plug', protocol: 'zigbee', status: { power: 'on' } },
      { name: 'Porta Principal', type: 'lock', protocol: 'zwave', status: { power: 'on', locked: true } },
      { name: 'Garagem - Luz', type: 'light', protocol: 'wifi', status: { power: 'off' } },
    ];

    const deviceIds: number[] = [];
    for (const device of devices) {
      const result = await pool.query(
          'INSERT INTO devices (name, type, protocol, status) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING id',
          [device.name, device.type, device.protocol, JSON.stringify(device.status)]
      );
      if (result.rows.length > 0) {
        deviceIds.push(result.rows[0].id);
        console.log(`  ✓ ${device.name}`);
      }
    }

    // Create scenarios
    console.log('⚡ Creating automation scenarios...');
    const scenarios = [
      {
        name: 'Modo Noite',
        description: 'Desliga todas as luzes às 23h',
        trigger: { type: 'time', value: '23:00' },
        actions: [{ deviceId: deviceIds[0], command: 'off' }],
        enabled: true,
      },
      {
        name: 'Chegada em Casa',
        description: 'Liga luzes e ar condicionado',
        trigger: { type: 'location', value: 'home' },
        actions: [
          { deviceId: deviceIds[0], command: 'on' },
          { deviceId: deviceIds[1], command: 'on' },
        ],
        enabled: true,
      },
      {
        name: 'Economia de Energia',
        description: 'Desliga dispositivos ociosos',
        trigger: { type: 'energy', threshold: 1000 },
        actions: [{ deviceId: deviceIds[2], command: 'off' }],
        enabled: false,
      },
    ];

    for (const scenario of scenarios) {
      await pool.query(
          'INSERT INTO scenarios (name, description, trigger, actions, enabled) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
          [scenario.name, scenario.description, JSON.stringify(scenario.trigger), JSON.stringify(scenario.actions), scenario.enabled]
      );
      console.log(`  ✓ ${scenario.name}`);
    }

    // Create energy consumption data
    console.log('🔋 Creating energy consumption data...');
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // Last 24 hours
      for (const deviceId of deviceIds.slice(0, 3)) {
        const powerWatts = Math.floor(Math.random() * 500) + 100; // 100-600W
        await pool.query(
          'INSERT INTO energy_consumption (device_id, power_watts, timestamp) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
          [deviceId, powerWatts, timestamp]
        );
      }
    }
    console.log('  ✓ 72 energy records created');

    // Create security events
    console.log('🔒 Creating security events...');
    const securityEvents = [
      { type: 'door_opened', severity: 'low', description: 'Porta principal aberta às 08:30' },
      { type: 'motion_detected', severity: 'medium', description: 'Movimento detectado na garagem' },
      { type: 'unauthorized_access', severity: 'high', description: 'Tentativa de acesso não autorizado' },
      { type: 'alarm_triggered', severity: 'critical', description: 'Alarme disparado - janela quebrada' },
      { type: 'door_locked', severity: 'low', description: 'Porta trancada automaticamente' },
    ];

    for (let i = 0; i < securityEvents.length; i++) {
      const event = securityEvents[i];
      const timestamp = new Date(now.getTime() - i * 2 * 60 * 60 * 1000); // Last 10 hours
      await pool.query(
        'INSERT INTO security_events (user_id, event_type, severity, description, created_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [userId, event.type, event.severity, event.description, timestamp]
      );
      console.log(`  ✓ ${event.type} (${event.severity})`);
    }

    // Create health metrics
    console.log('❤️ Creating health metrics...');
    const healthMetrics = [
      { type: 'heart_rate', min: 60, max: 100 },
      { type: 'temperature', min: 36.0, max: 37.5 },
      { type: 'steps', min: 5000, max: 15000 },
      { type: 'sleep', min: 6, max: 9 },
    ];

    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now.getTime() - i * 3 * 60 * 60 * 1000); // Last 60 hours
      for (const metric of healthMetrics) {
        const value = Math.random() * (metric.max - metric.min) + metric.min;
        await pool.query(
          'INSERT INTO health_metrics (user_id, metric_type, value, timestamp) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [userId, metric.type, Math.round(value * 10) / 10, timestamp]
        );
      }
    }
    console.log('  ✓ 80 health records created');

    // Create event logs
    console.log('📝 Creating event logs...');
    const eventLogs = [
      { type: 'device_state_change', description: 'Luz da sala ligada' },
      { type: 'scenario_executed', description: 'Modo Noite ativado' },
      { type: 'user_login', description: 'Login realizado com sucesso' },
      { type: 'device_added', description: 'Novo dispositivo registrado' },
    ];

    for (let i = 0; i < eventLogs.length; i++) {
      const log = eventLogs[i];
      const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
      await pool.query(
          'INSERT INTO events (user_id, event_type, data, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
          [userId, log.type, JSON.stringify({ description: log.description }), timestamp]
      );
      console.log(`  ✓ ${log.type}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - ${devices.length} devices`);
    console.log(`  - ${scenarios.length} scenarios`);
    console.log(`  - 72 energy records`);
    console.log(`  - ${securityEvents.length} security events`);
    console.log(`  - 80 health metrics`);
    console.log(`  - ${eventLogs.length} event logs`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedData();
