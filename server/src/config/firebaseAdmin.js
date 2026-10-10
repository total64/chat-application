
const {
  getApps,
  initializeApp,
  applicationDefault
} = require("firebase-admin/app");

const getAuth = require("firebase-admin/auth").getAuth;

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault()
      });

const firebaseAuth = getAuth(app);

module.exports = firebaseAuth;
