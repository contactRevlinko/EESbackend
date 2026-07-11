const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

let serviceAccount;

// Method 1: Try full JSON string first
if (process.env.FIREBASE_ADMIN_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
  } catch (error) {
    console.error("FIREBASE_ADMIN_KEY JSON parse failed, trying individual vars...");
  }
}

// Method 2: Use individual environment variables (more reliable on Vercel)
if (!serviceAccount) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined;

  if (process.env.FIREBASE_PROJECT_ID && privateKey && process.env.FIREBASE_CLIENT_EMAIL) {
    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: "googleapis.com",
    };
  } else {
    throw new Error(
      "Firebase credentials not found. Set either FIREBASE_ADMIN_KEY or individual FIREBASE_* environment variables."
    );
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
