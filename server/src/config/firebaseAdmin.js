
const {
  getApps,
  initializeApp,
  applicationDefault
} = require("firebase-admin/app");

const { getAuth } = require("firebase-admin/auth");

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: applicationDefault()
      });

module.exports = getAuth(app);