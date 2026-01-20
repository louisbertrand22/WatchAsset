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

app.get('/auth/login', (req, res) => {
  const ssoUrl = 'http://localhost:3000/authorize'; // Port de ton MySSO
  const clientId = 'watch-asset-app';
  const redirectUri = encodeURIComponent('http://localhost:3001/auth/callback');
  
  // On construit l'URL pour demander l'autorisation
  const authUrl = `${ssoUrl}?client_id=${clientId}&response_type=code&scope=openid email profile&redirect_uri=${redirectUri}`;
  
  res.redirect(authUrl);
});

// Route 2 : Le Callback (là où MySSO renvoie l'utilisateur avec un code)
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Code d'autorisation manquant");
  }

  try {
    // Ici, plus tard, on appellera exchangeCodeForTokens() 
    // Pour l'instant, on affiche le code pour vérifier que ça communique !
    res.json({ 
      message: "Succès ! MySSO nous a renvoyé un code.",
      code: code 
    });
  } catch (error) {
    res.status(500).send("Erreur lors de l'échange du code");
  }
});