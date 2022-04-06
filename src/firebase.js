import { initializeApp } from "firebase/app";
import {GoogleAuthProvider,getAuth,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,sendPasswordResetEmail,singOut} from "firebase/auth";
import {getFirestore,query,getDocs,collection,where,addDoc} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCPt_6W95_a63qCoapur-C9mzz9uJGG1uY",
    authDomain: "autotek-8c725.firebaseapp.com",
    projectId: "autotek-8c725",
    storageBucket: "autotek-8c725.appspot.com",
    messagingSenderId: "331835875863",
    appId: "1:331835875863:web:196d016fc1488af40c7252",
    measurementId: "G-67MEGP9H81"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export function getTheAuth ()
{
    return auth;
}
export async function signIn (email, password)
{
    return await signInWithEmailAndPassword(auth, email, password)
    /*
        .then((response) => {
            return response;
         // sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
        })*/
}
export async function singingOut ()
{
    return await auth.signOut();
}