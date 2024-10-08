import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, connectAuthEmulator, getAuth,  } from "firebase/auth";

console.log("Environment Variables:");
console.log("REACT_APP_apiKey:", process.env.REACT_APP_apiKey);
console.log("REACT_APP_authDomain:", process.env.REACT_APP_authDomain);
console.log("REACT_APP_projectId:", process.env.REACT_APP_projectId);
console.log("REACT_APP_storageBucket:", process.env.REACT_APP_storageBucket);
console.log("REACT_APP_messagingSenderId:", process.env.REACT_APP_messagingSenderId);
console.log("REACT_APP_appId:", process.env.REACT_APP_appId);
console.log("REACT_APP_measurementId:", process.env.REACT_APP_measurementId);

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId
  };
  
  const app = initializeApp(firebaseConfig);
  console.log(firebaseConfig);
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  if (window.location.hostname === "localhost") {
    connectAuthEmulator(auth, "http://localhost:9099");
  }  
  export { auth, provider }