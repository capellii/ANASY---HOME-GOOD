
import express from 'express';
import authRoutes from './routes/authRoutes';
import deviceRoutes from './routes/deviceRoutes';
import scenarioRoutes from './routes/scenarioRoutes';

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
