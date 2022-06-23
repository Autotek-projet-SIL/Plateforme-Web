import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPt_6W95_a63qCoapur-C9mzz9uJGG1uY",
  authDomain: "autotek-8c725.firebaseapp.com",
  projectId: "autotek-8c725",
  storageBucket: "autotek-8c725.appspot.com",
  messagingSenderId: "331835875863",
  appId: "1:331835875863:web:196d016fc1488af40c7252",
  measurementId: "G-67MEGP9H81",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();
export async function getCarLocations(setLocations) {
  const q = query(collection(db, "CarLocation"));
  onSnapshot(q, (querySnapshot) => setLocations(querySnapshot));
}
export function getTheAuth() {
  //Retourne l'objet auth pour l'authentification firebase
  return auth;
}
export async function signIn(email, password) {
  //Connexion
  return await signInWithEmailAndPassword(auth, email, password);
}
export async function signUp(email, password) {
  //Creer un compte dans firebase
  return await createUserWithEmailAndPassword(auth, email, password);
}
export async function singingOut() {
  // Deconnexion
  return await auth.signOut();
}
export async function addImage(img, folderUser, uid) {
  //Ajouter une image au firestore
  const storageRef = ref(storage, folderUser + "/" + uid + img.name);
  //Upload de l'image dans firbase
  return await uploadBytes(storageRef, img)
    .then(async (snapshot) => {
      //Recuperer le lien de l'image
      return await getDownloadURL(storageRef).then((url) => {
        return url;
      });
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
}
export async function removeImage(url) {
  //Supprimer une image du firestore
  let imageRef = ref(storage, url);
  return await deleteObject(imageRef);
}
export async function modifEmail(email) {
  //Modifier l'adresse mail de l'utilisateur authentifié
  return await updateEmail(auth.currentUser, email);
}
export async function modifPassword(pwd) {
  //Modifier le mot de passe de l'utilisateur authentifié
  return await updatePassword(auth.currentUser, pwd);
}
