import './stylesheets/PageATC.css';
import {useContext, useEffect, useState} from "react";
import {useNavigate} from 'react-router-dom';
import { UserContext } from "../../Context.js";
import AuthATC from './AuthATC';
import GestionVehicules from './GestionVehicules';
import GestionDemandes from './GestionDemandes';
import GestionComptes from './GestionComptes';
import CompteATC from './CompteATC';
import AccueilATC from './AccueilATC';
function PageATC() {
  //container qui redirige les pages du ATC
  const navigate = useNavigate();
  const {user, login, logout} = useContext(UserContext);
  let redirection = false;
  function setRedirection (dest)
  {
    // s'il est nécessaire de rediriger : se rediriger vers la destination
    redirection = dest;
  }
  useEffect (()=>{
    if (redirection!==false)
    {
     navigate(redirection)
    }
    
    // test si le ATC est déja authentifié selon les données persistantes
    if (window.localStorage.getItem("auth")==="true")
    {
      let userInfo = {id:window.localStorage.getItem("autUserId")}; // fetch from bdd using the id : USE TOKEN TO MAKE IT SECURE
      login (userInfo, window.localStorage.getItem("type"));
    }
    else{
      logout();
    }
  }, []);

  // test si le ATC est authentifié ou pas
  if (window.localStorage.getItem("auth") === "false")
    {
      if (window.location.pathname!=="/atc/inscription")
       {
          setRedirection('/atc/inscription');
          return (null);
       }
       else{
         return (<AuthATC/>)
       }
    }
    else{
      //test si l'utilisateur authentifié est bien un ATC
      
      if (window.localStorage.getItem("type") === "atc")
      {
        switch (window.location.pathname)
        {
          case "/atc/accueil" :
            return (<AccueilATC/>);
          case "/atc/monprofil":
            return (<CompteATC/>);
          case "/atc/gestiondemandes":
            return (<GestionDemandes/>);
          case "/atc/gestioncomptes":
            return (<GestionComptes/>);
          case "/atc/gestionvehicules":
            return (<GestionVehicules/>);
          case "/atc/inscription":
          case "/atc/inscription/":
          case "/atc":
          case "/atc/":
            setRedirection('/atc/accueil');
            return(null);
          default :
            setRedirection('/404');
            return (null);
        }
      }
    else{
      setRedirection('/decideur');
      return (null);
  }
  }
 
}

export default PageATC;