import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'moovest.firebaseapp.com',
  projectId: 'moovest',
  storageBucket: 'moovest.firebasestorage.app',
  messagingSenderId: '614413347907',
  appId: '1:614413347907:web:80fc4d8f32e2f2569a38f6',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export default app
