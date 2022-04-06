import {useState, createContext, useEffect} from "react";
import { signIn, getTheAuth, singingOut } from "./firebase";
import http from "./http.js";
import {encryptData, decryptData} from "./crypto.js"
// contexte qui sauvegarde l'utilisateur : variable globale

export const UserContext = createContext({
    autUser: 'null'});

export const UserProvider = ({ children }) => {
        const [user, setUser] = useState({ });
        /*useEffect(()=>{
          if (("auth" in window.localStorage)&&(decryptData (window.localStorage.getItem('auth'), secretKey.previous)==="true")&&(secretKey.previous!==""))
          {
            window.localStorage.setItem('auth', encryptData(decryptData (window.localStorage.getItem('auth'), secretKey.previous) )); // authentifié
            window.localStorage.setItem('type' ,encryptData(decryptData (window.localStorage.getItem('type'), secretKey.previous) )); // type de l'utilisateur atc/décideur
            window.localStorage.setItem('autUserEmail', encryptData(decryptData (window.localStorage.getItem('autUserEmail'), secretKey.previous) )); // email de l'utilisateur
            window.localStorage.setItem('autUserId', encryptData(decryptData (window.localStorage.getItem('autUserId'), secretKey.previous) )); // ID de l'utilisateur
            window.localStorage.setItem('authToken', encryptData(decryptData (window.localStorage.getItem('authToken'), secretKey.previous) ))// Access token
          }
        }, [secretKey]);*/
        const login = async (autUser, typeUser) => {
        //  setSecret({previous:secretKey.current, current:randomKey()})
          // logging + Mise à jour du contexte + du local storage (Cache : pour les données persistantes)
          let response;
          try {
            response = await signIn(autUser.email, autUser.mdp);
          }
          catch(error)
          {
            console.log(error)
            if (error.startsWith("FirebaseError: Firebase: Error (auth/network-request-failed)"))
            {
              alert("Erreur de connexion");
            }
            else{
              alert("Identifiants incorrects");
            }
          }
          finally 
          {
            
            if (typeUser==="atc")
          {
            http.get(`authentification_web/atc_connexion/${autUser.email}`, {"headers": {
              "token" : response.user.accessToken,
              "id": response.user.uid,
            }}).then(jResponse=>{
                if(jResponse.data.length===0)
                 {
                  alert("Identifiants incorrects");
                 }
                 else{
                  window.localStorage.setItem('auth',encryptData("true" ) ); // authentifié
                  window.localStorage.setItem('type' , encryptData(typeUser )); // type de l'utilisateur atc/décideur
                  window.localStorage.setItem('autUserEmail',encryptData(jResponse.data[0].email ) ); // email de l'utilisateur
                  window.localStorage.setItem('autUserId',encryptData(response.user.uid ) ); // ID de l'utilisateur
                  window.localStorage.setItem('authToken',encryptData(response.user.accessToken ) )// Access token
                  setUser(jResponse.data[0]);
                  
                window.location.reload();
                 }
            }).catch(err=>{
              alert("Identifiants incorrects");
              console.log(err)
            })
            
          }
          else{
          }

          }
          
        };
        
        const refreshUser = async ()=>{
          getTheAuth().onAuthStateChanged(async (currentUser)=>{
            window.localStorage.setItem('authToken', encryptData(await currentUser.getIdToken()));
            window.localStorage.setItem('autUserId', encryptData(currentUser.uid ));
            http.get(`authentification_web/atc_connexion/${decryptData(window.localStorage.getItem('autUserEmail') )}`, {"headers": {
              "token" : await currentUser.getIdToken() ,
              "id": currentUser.uid ,
            }}).then(jResponse=>{
                if(jResponse.data.length===0)
                 {
                  alert("Vous n'avez pas accès à ce contenu");
                  loggingOut()
                 }
                 else{
                //  setSecret({previous:secretKey.current, current:randomKey()})
                  setUser(jResponse.data[0]);
                 }
            }).catch(err=>{
              alert("Vous n'avez pas accès à ce contenu");
              logout()
            })
          })
          
         

          
        };
        const logout = () => {
          // logout + Mise à jour du contexte + du local storage (Cache : pour les données persistantes)
          window.localStorage.setItem('auth',encryptData("false" ) ); //Non authentifié
          window.localStorage.removeItem('type');
          window.localStorage.removeItem('autUserId');
          window.localStorage.removeItem('authToken');
          window.localStorage.removeItem('autUserEmail');
          setUser('');
          singingOut();
        };
        const loggingOut = () => {
          // lougout + reloading page
          logout();
          window.location.reload();
        };
        
        //Retourner le contexte 
        return (
          <UserContext.Provider value={{ user, login,refreshUser, logout, loggingOut }}>
            {children}
          </UserContext.Provider>
        );
      }