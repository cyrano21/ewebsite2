// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId:import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export default app;





//const firebaseConfig = {
 // apiKey: "AIzaSyDcCh6YtKjGVDFqasfysvGWACLHeZ8LtGI",
 // authDomain: "e-commerce-website-a1656.firebaseapp.com",
  //projectId: "e-commerce-website-a1656",
 // storageBucket: "e-commerce-website-a1656.appspot.com",
  //messagingSenderId: "681448933251",
 // appId: "1:681448933251:web:1f1da30fd03dc4edb318b6",
 // measurementId: "G-34KYEZQFKX"
//};
