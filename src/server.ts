import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Use the auth routes
app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'WatchAsset API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 WatchAsset API lancée sur http://localhost:${PORT}`);
});