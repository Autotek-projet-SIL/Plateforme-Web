import {useState, createContext, useEffect} from "react";
import { signIn, getTheAuth,addImage, singingOut, signUp } from "./firebase";
import http from "./http.js";
import {encryptData, decryptData} from "./crypto.js"
import { useAlert } from 'react-alert';
// contexte qui sauvegarde l'utilisateur : variable globale

export const UserContext = createContext({
    autUser: 'null'});

export const UserProvider = ({ children }) => {
  const alert = useAlert();
  const [user, setUser] = useState({});
  const [currentInfos, setCurrent] = useState(null);
  const [loading, setLoading] = useState (false);
       const login = async (autUser, typeUser) => {
        //  setSecret({previous:secretKey.current, current:randomKey()})
          // logging + Mise à jour du contexte + du local storage (Cache : pour les données persistantes)
          let response;
          try {
            setLoading(true)
            response = await signIn(autUser.email, autUser.mdp);
            // Verifier l'existence de l'utilisateur dans le système et récuperer son id + token
            if (typeUser==="atc")
            {
              //L'utilisateur est un ATC
              http.get(`authentification_web/atc_connexion/${autUser.email}`, {"headers": {
                "token" : response.user.accessToken,
                "id_sender": response.user.uid,
              }}).then(jResponse=>{
                setLoading(false)
                  if(jResponse.data.length===0)
                   {
                    alert.error("Identifiants incorrects");
                   }
                   else{
                    window.localStorage.setItem('auth',encryptData("true" ) ); // authentifié
                    window.localStorage.setItem('type' , encryptData(typeUser )); // type de l'utilisateur atc/décideur
                    window.localStorage.setItem('currEm',encryptData(jResponse.data[0].email ) ); // email de l'utilisateur
                    window.localStorage.setItem('curruId',encryptData(response.user.uid ) ); // ID de l'utilisateur
                    window.localStorage.setItem('currTok',encryptData(response.user.accessToken ) )// Access token
                    setUser(jResponse.data[0]);
                    
                  window.location.reload();
                   }
              }).catch((err)=>{
                setLoading(false)
                if (err.message === "Network Error")
                {
                  alert.error("Une erreur est survenue, veuillez vérifier votre connexion ou réessayer utérieurement.");
                }
                else{
                  alert.error("Identifiants incorrects");
                  
                }
              })      
            }
            else{
              // L'utilisateur est un decideur
              http.get(`authentification_web/decideur_connexion/${autUser.email}`, {"headers": {
                "token" : response.user.accessToken,
                "id_sender": response.user.uid,
              }}).then(jResponse=>{
                setLoading(false)
                  if(jResponse.data.length===0)
                   {
                    alert.error("Identifiants incorrects");
                   }
                   else{
                    window.localStorage.setItem('auth',encryptData("true" ) ); // authentifié
                    window.localStorage.setItem('type' , encryptData(typeUser )); // type de l'utilisateur atc/décideur
                    window.localStorage.setItem('currEm',encryptData(jResponse.data[0].email ) ); // email de l'utilisateur
                    window.localStorage.setItem('curruId',encryptData(response.user.uid ) ); // ID de l'utilisateur
                    window.localStorage.setItem('currTok',encryptData(response.user.accessToken ) )// Access token
                    setUser(jResponse.data[0])
                    window.location.reload();
                   }
              }).catch(err=>{
                setLoading(false)
                if (err.message === "Network Error")
                {
                  alert.error("Une erreur est survenue, veuillez vérifier votre connexion ou réessayer utérieurement.");
                }
                else{
                  alert.error("Identifiants incorrects");
                }
              })  
            }
          }
          catch(error)
          {
            setLoading(false)
            console.log(error.message)
            if (error.message === "Firebase: Error (auth/user-not-found).")
            {
              alert.error("Identifiants incorrects");
            }
            else{
              alert.error("Une erreur est survenue, veuillez vérifier votre connexion ou réessayer utérieurement.");
            }
          }
          
        };
/*  const getCurrentCredentials = async()=>{
    getTheAuth().onAuthStateChanged((currentUser)=>{
        setCurrent(currentUser)
    })
    return {token: await currentInfos.getIdToken(), uid :  currentInfos.uid }
  }*/
        const refreshUser = async (type)=>{
          //Rafraischir l'objet user du context + modifier les id/token dans localstorage au changement du state
          getTheAuth().onIdTokenChanged(async (currentUser)=>{
              setLoading(true)
              window.localStorage.setItem('currTok', encryptData(await currentUser.getIdToken()));
              window.localStorage.setItem('curruId', encryptData(currentUser.uid ));
              if (type === "atc")
              {
                http.get(`authentification_web/atc_connexion/${decryptData(window.localStorage.getItem('currEm') )}`, {"headers": {
                  "token" : await currentUser.getIdToken() ,
                  "id_sender": currentUser.uid ,
                }}).then(jResponse=>{
                  setLoading(false)
                    if(jResponse.data.length===0)
                    {
                      alert.error("Il semble que vous n'avez pas accès à ce contenu.");
                      loggingOut()
                    }
                    else{
                    //  setSecret({previous:secretKey.current, current:randomKey()})
                      setUser(jResponse.data[0]);
                      
                    }
                }).catch(err=>{
                  setLoading(false)
                  if (err.message === "Network Error")
                  {
                    alert.error("Une erreur est survenue, veuillez vérifier votre connexion ou réessayer utérieurement.");
                  }
                  else{
                    alert.error("Il semble que vous n'avez pas accès à ce contenu.");
                    logout()
                  }                
                })
              }
              else{
                http.get(`authentification_web/decideur_connexion/${decryptData(window.localStorage.getItem('currEm') )}`, {"headers": {
                  "token" : await currentUser.getIdToken() ,
                  "id_sender": currentUser.uid ,
                }}).then(jResponse=>{
                  setLoading(false)
                    if(jResponse.data.length===0)
                    {
                      alert.error("Il semble que vous n'avez pas accès à ce contenu.");
                      loggingOut()
                    }
                    else{
                    //  setSecret({previous:secretKey.current, current:randomKey()})
                      setUser(jResponse.data[0]);
                    }
                }).catch(error=>{
                  if (error.message === "Network Error")
                  {
                    alert.error("Une erreur est survenue, veuillez vérifier votre connexion ou réessayer utérieurement.");
                  }
                  else{
                    alert.error("Il semble que vous n'avez pas accès à ce contenu.");
                    loggingOut()
                  }  
                  
                })
              }
             
          })
          
        };
        const logout = () => {
          // logout + Mise à jour du contexte + du local storage (Cache : pour les données persistantes)
          window.localStorage.setItem('auth',encryptData("false" ) ); //Non authentifié
          window.localStorage.removeItem('type');
          window.localStorage.removeItem('curruId');
          window.localStorage.removeItem('currTok');
          window.localStorage.removeItem('currEm');
          setUser('');
          singingOut();
        };
        const loggingOut = () => {
          // lougout + reloading page
          logout();
          window.location.reload();
        };
        const createUser = async(email, mdp)=>{
          return await signUp(email,mdp);
        }
        const createImage = async (img, userType,uid)=>{
            const url = await addImage(img,userType,uid);
            return url;
        }
        //Retourner le contexte 
        return (
          <UserContext.Provider value={{ loading, setLoading, user, login,refreshUser,/*getCurrentCredentials,*/ logout, createUser,createImage, loggingOut }}>
            {children}
          </UserContext.Provider>
        );
      }