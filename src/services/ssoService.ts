import axios from 'axios';

const SSO_BASE_URL = 'http://localhost:3000';
const CLIENT_ID = 'watch-asset-app';
const CLIENT_SECRET = 'votre_secret_genere'; // À mettre dans .env
const REDIRECT_URI = 'http://localhost:3001/auth/callback';

export const exchangeCodeForTokens = async (code: string, codeVerifier: string) => {
  try {
    const response = await axios.post(`${SSO_BASE_URL}/token`, {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET, // Si confidentiel
      code_verifier: codeVerifier // Nécessaire pour PKCE
    });

    return response.data; // Contient access_token, id_token, refresh_token
  } catch (error) {
    console.error('Erreur lors de l\'échange de tokens:', error.response?.data || error.message);
    throw new Error('Authentification échouée');
  }
};

export const getUserInfo = async (accessToken: string) => {
  const response = await axios.get(`${SSO_BASE_URL}/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data;
};