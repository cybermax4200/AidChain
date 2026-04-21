import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ngoRoutes from './routes/ngo';
import beneficiaryRoutes from './routes/beneficiary';
import conditionRoutes from './routes/conditions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/ngo', ngoRoutes);
app.use('/api/beneficiary', beneficiaryRoutes);
app.use('/api/conditions', conditionRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`AidChain API running on port ${PORT}`);
});
