
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes';
import deviceRoutes from './routes/deviceRoutes';
import scenarioRoutes from './routes/scenarioRoutes';
import energyRoutes from './routes/energyRoutes';
import securityRoutes from './routes/securityRoutes';
import healthRoutes from './routes/healthRoutes';
import eventRoutes from './routes/eventRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('ANASY Backend API is running!');
});

// Rotas principais

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
