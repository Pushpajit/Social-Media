
const { initializeApp } = require("firebase/app");
const { getStorage } =  require("firebase/storage");
const dotenv = require("dotenv");

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStorage = getStorage(app);

module.exports = { fireStorage }