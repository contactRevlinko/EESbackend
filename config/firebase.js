const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

let admin = null;

try {
  const firebaseAdmin = require("firebase-admin");

  let serviceAccount = null;

  // Method 1: Try full JSON string
  if (process.env.FIREBASE_ADMIN_KEY) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);
      console.log("[Firebase] Using FIREBASE_ADMIN_KEY JSON");
    } catch (e) {
      console.warn("[Firebase] FIREBASE_ADMIN_KEY JSON parse failed:", e.message);
    }
  }

  // Method 2: Use individual environment variables
  if (!serviceAccount && process.env.FIREBASE_PROJECT_ID) {
    const rawKey = process.env.FIREBASE_PRIVATE_KEY || "";
    const privateKey = rawKey.replace(/\\n/g, "\n");

    serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "",
      private_key: privateKey,
      client_email: process.env.FIREBASE_CLIENT_EMAIL || "",
      client_id: process.env.FIREBASE_CLIENT_ID || "",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || "",
      universe_domain: "googleapis.com",
    };
    console.log("[Firebase] Using individual FIREBASE_* env vars");
  }

  if (serviceAccount) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(serviceAccount),
    });
    admin = firebaseAdmin;
    console.log("[Firebase] Initialized successfully ✅");
  } else {
    console.warn("[Firebase] ⚠️ No credentials found. Firebase features will be disabled.");
  }
} catch (err) {
  console.error("[Firebase] Initialization failed (non-fatal):", err.message);
}

module.exports = admin;
