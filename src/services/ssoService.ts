import axios from 'axios';

const SSO_BASE_URL = process.env.SSO_BASE_URL || 'http://localhost:3000';
const CLIENT_ID = process.env.SSO_CLIENT_ID || 'watch-asset-app';
const REDIRECT_URI = process.env.SSO_REDIRECT_URI || 'http://localhost:3001/auth/callback';

export const exchangeCodeForTokens = async (code: string, codeVerifier: string) => {
  console.log("--- DEBUG ENV COMPLET ---");
  console.log("PORT:", process.env.PORT);
  console.log("SSO_CLIENT_ID:", process.env.SSO_CLIENT_ID);
  console.log("SSO_CLIENT_SECRET:", process.env.SSO_CLIENT_SECRET);
  console.log("--------------------------");
  const clientSecret = process.env.SSO_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error('SSO_CLIENT_SECRET is not configured. Please set it in your .env file.');
  }
  
  try {
    const response = await axios.post(`${SSO_BASE_URL}/token`, {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: clientSecret, // Si confidentiel
      code_verifier: codeVerifier // Nécessaire pour PKCE
    });

    return response.data; // Contient access_token, id_token, refresh_token
  } catch (error: any) {
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