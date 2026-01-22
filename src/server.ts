// src/server.ts

// Plus besoin de : import dotenv from 'dotenv'; dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app = express();
// Ici, process.env.SSO_CLIENT_SECRET sera déjà rempli par Node.js
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'WatchAsset API is running' });
});

app.listen(PORT, () => {
  const backendUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
  console.log(`🚀 WatchAsset API lancée sur ${backendUrl}`);
});