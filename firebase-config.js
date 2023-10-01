
const { initializeApp } = require("firebase/app");
const { getStorage } =  require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAlYhydpRFOphVvSm7DDvZ0jvf3O6phG8Q",
  authDomain: "social-media-af11f.firebaseapp.com",
  projectId: "social-media-af11f",
  storageBucket: "social-media-af11f.appspot.com",
  messagingSenderId: "1052632246192",
  appId: "1:1052632246192:web:007ab30cf4a97555d91875"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireStorage = getStorage(app);

module.exports = { fireStorage }