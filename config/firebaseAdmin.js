const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const getFormattedPrivateKey = () => {
  let key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;

  key = key.trim();

  // Strip leading and trailing quotes if present (e.g., when set in Render env vars)
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }

  // Replace escaped newlines with actual newline characters
  key = key.replace(/\\n/g, "\n").replace(/\r\n/g, "\n");

  return key.trim();
};

if (!getApps().length) {
  try {
    const privateKey = getFormattedPrivateKey();
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (err) {
    console.error("Firebase Admin initialization error:", err.message);
  }
}

module.exports = { getAuth };

