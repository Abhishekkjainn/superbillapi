// Load environment variables from .env file
require('dotenv').config();

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Load credentials from environment variables
const serviceAccount = {
  projectId: process.env.GOOGLE_PROJECT_ID,
  privateKeyId: process.env.GOOGLE_PRIVATE_KEY_ID,
  privateKey: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure private key line breaks are handled correctly
  clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  clientId: process.env.GOOGLE_CLIENT_ID,
  authUri: process.env.GOOGLE_AUTH_URI,
  tokenUri: process.env.GOOGLE_TOKEN_URI,
  authProviderCertUrl: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  clientCertUrl: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  universeDomain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

module.exports = { db };
