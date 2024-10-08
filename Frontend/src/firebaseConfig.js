import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, connectAuthEmulator, getAuth,  } from "firebase/auth";


const apiKey = process.env.REACT_APP_apiKey
const authDomain = process.env.REACT_APP_authDomain
const projectId = process.env.REACT_APP_projectId
const storageBucket = process.env.REACT_APP_storageBucket
const messagingSenderId = process.env.REACT_APP_messagingSenderId
const appId = process.env.REACT_APP_appId
const measurementId = process.env.REACT_APP_measurementId

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
  };
  
  const app = initializeApp(firebaseConfig);
  console.log(firebaseConfig);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  if (window.location.hostname === "localhost") {
    connectAuthEmulator(auth, "http://localhost:9099");
  }  
  export { auth, provider }