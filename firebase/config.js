
// firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBT8sVBmEma2cSj6vwhBnwtroicEPCqF3M",
  authDomain: "vapeonxwebapp.firebaseapp.com",
  projectId: "vapeonxwebapp",
  storageBucket: "vapeonxwebapp.firebasestorage.app",
  messagingSenderId: "278848340381",
  appId: "1:278848340381:web:91a6b8a88e68ed5654ef74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;