import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'WatchAsset API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 WatchAsset API lancée sur http://localhost:${PORT}`);
});