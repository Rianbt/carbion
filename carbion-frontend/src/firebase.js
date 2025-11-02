// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Adicione isso para autenticação

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-3oZck_YQI_ZgUzJ6lZ-GN21X3BEbvy4",
  authDomain: "carbion-62660.firebaseapp.com",
  projectId: "carbion-62660",
  storageBucket: "carbion-62660.firebasestorage.app",
  messagingSenderId: "526750767878",
  appId: "1:526750767878:web:979be0c271471d0a915c87",
  measurementId: "G-B8BZ9PYWME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Exporte auth para usar em Login/Cadastro