import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import {
  apiKey,
  appId,
  authDomain,
  databaseURL,
  measurementId,
  messagingSenderId,
  projectId,
  storageBucket,
} from "../utils/consts";
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
  databaseURL: databaseURL,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getDatabase(app);
export { auth, db, storage };
