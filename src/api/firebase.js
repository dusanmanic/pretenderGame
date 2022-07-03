import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCy9e5JE-gmOrhSXN4yc6f6U97fQfQZoeY",
  authDomain: "wholewheatgames-9eafb.firebaseapp.com",
  databaseURL: "https://wholewheatgames-9eafb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wholewheatgames-9eafb",
  storageBucket: "wholewheatgames-9eafb.appspot.com",
  messagingSenderId: "309309889852",
  appId: "1:309309889852:web:29c7b53545e22e6f495239",
  measurementId: "G-MEH4Q56PC3"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)

