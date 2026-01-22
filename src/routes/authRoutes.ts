import { Router } from 'express';
import { exchangeCodeForTokens, getUserInfo } from '../services/ssoService.js';

const router = Router();

// 1. Route pour démarrer la connexion
router.get('/login', (req, res) => {
  // Dans un vrai projet, génère un code_challenge ici (PKCE)
  const ssoBaseUrl = process.env.SSO_BASE_URL || 'http://localhost:3000';
  const clientId = process.env.SSO_CLIENT_ID || 'watch-asset-app';
  const redirectUri = process.env.SSO_REDIRECT_URI || 'http://localhost:3001/auth/callback';
  const authUrl = `${ssoBaseUrl}/authorize?client_id=${clientId}&response_type=code&scope=openid email profile&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
});

// 2. Route de callback (Retour du SSO)
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send("Code d'autorisation manquant");
  }

  try {
    // On échange le code contre les tokens
    // Note: On passe un code_verifier vide ou stocké en session pour PKCE
    const tokens = await exchangeCodeForTokens(code as string, "verifier_si_utilise");
    
    // On récupère les infos de l'utilisateur (email, id)
    const user = await getUserInfo(tokens.access_token);
    
    // Créer une session ou un cookie JWT pour WatchAsset
    // Pour simplifier, on encode les données dans l'URL (dans un vrai projet, utiliser des cookies sécurisés)
    const userParam = encodeURIComponent(JSON.stringify({ 
      email: user.email, 
      name: user.name || user.email,
      id: user.sub || user.id
    }));
    
    // Rediriger vers le dashboard frontend avec les informations de l'utilisateur
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/dashboard?user=${userParam}&token=${tokens.access_token}`);
  } catch (err) {
    console.error('Erreur d\'authentification:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}?error=auth_failed`);
  }
});

export default router;