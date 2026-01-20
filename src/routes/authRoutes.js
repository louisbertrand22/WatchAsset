import { Router } from 'express';
import { exchangeCodeForTokens, getUserInfo } from '../services/ssoService';
const router = Router();
// 1. Route pour démarrer la connexion
router.get('/login', (req, res) => {
    // Dans un vrai projet, génère un code_challenge ici (PKCE)
    const authUrl = `http://localhost:3000/authorize?client_id=watch-asset-app&response_type=code&scope=openid email profile&redirect_uri=http://localhost:3001/auth/callback`;
    res.redirect(authUrl);
});
// 2. Route de callback (Retour du SSO)
router.get('/callback', async (req, res) => {
    const { code } = req.query;
    try {
        // On échange le code contre les tokens
        // Note: On passe un code_verifier vide ou stocké en session pour PKCE
        const tokens = await exchangeCodeForTokens(code, "verifier_si_utilise");
        // On récupère les infos de l'utilisateur (email, id)
        const user = await getUserInfo(tokens.access_token);
        // Ici, tu peux créer une session locale ou un cookie JWT pour WatchAsset
        // Et rediriger vers le dashboard
        res.json({ message: "Connecté avec succès !", user, tokens });
    }
    catch (err) {
        res.status(500).send("Erreur d'authentification");
    }
});
export default router;
//# sourceMappingURL=authRoutes.js.map