import { getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBcF4jUafzDMU7oAjWBlNLJARr282r9Duo",
  authDomain: "savor-b74f6.firebaseapp.com",
  projectId: "savor-b74f6",
  storageBucket: "savor-b74f6.appspot.com",
  messagingSenderId: "956015678432",
  appId: "1:956015678432:web:e6cc49e9f5ca2ed99d8c92"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export default app; 