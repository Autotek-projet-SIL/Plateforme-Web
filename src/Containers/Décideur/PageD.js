import './stylesheets/PageD.css';
import {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../../Context.js";
import AuthD from './AuthD';
import CompteD from './CompteD';
import AccueilD from './AccueilD';
import {encryptData, decryptData} from "../../crypto";
function PageD() {
  //container qui redirige les pages du Décideur
  let redirection = false;
  const navigate = useNavigate();
  const {secretKey, user, login, logout, refreshUser} = useContext(UserContext);
  function setRedirection (dest)
  {
    // redirection
    redirection = dest;
  }

  useEffect (()=>{
    if (redirection!==false)
    {
      // s'il est nécessaire de rediriger : se rediriger vers la destination
      navigate(redirection, { replace: true })
    }
     
    // test si le décideur est déja authentifié selon les données persistantes
    if (decryptData(window.localStorage.getItem("auth"),secretKey.current)==="true")
    {
      let userInfo = {id:window.localStorage.getItem("autUserId")}; // fetch from bdd using the id : USE TOKEN TO MAKE IT SECURE
      login (userInfo, decryptData(window.localStorage.getItem("type"),secretKey.current));
    }
    else{
      logout();
    }
  }, []);
  
  // test si le décideur est authentifié ou pas
  if (decryptData(window.localStorage.getItem("auth"),secretKey.current) === "false")
    {
      if (window.location.pathname!=="/decideur/authentification")
       {
          setRedirection('/decideur/authentification');
          return (null);
       }
       else{
         return (<AuthD/>)
       }
    }
    else{
      //test si l'utilisateur authentifié est bien un décideur
      if (decryptData(window.localStorage.getItem("type"),secretKey.current) === "decideur")
      {
        switch (window.location.pathname)
        {
          case "/decideur/accueil" :
            return (<AccueilD/>);
          case "/decideur/monprofil":
            return (<CompteD/>);
          case "/decideur/authentification":
          case "/decideur/authentification/":
          case "/decideur":
          case "/decideur/":
            setRedirection('/decideur/accueil');
            return(null);
          default :
            setRedirection('/404');
            return (null);
        }
      }
      else{
        setRedirection('/atc');
        return (null);
      }
      
    }
}

export default PageD;